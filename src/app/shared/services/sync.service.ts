import { Injectable } from '@angular/core';
import { AppStateService } from './appstate.service';
import { DatabaseService } from './database.service';
import { Contact } from '../models/contact';
import { HttpClient } from '@angular/common/http';
import { take, takeUntil } from 'rxjs/operators';
import { Subject, Observable, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/sync.response';
import { GenericAlertService } from './generic-alert.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private readonly url = `${environment.urlApi}/contacts`;
  private unsubscribe = new Subject<any>();
  private hasConnection: boolean;
  constructor(
    private appState: AppStateService,
    private platform: Platform,
    private gAlert: GenericAlertService,
    private database: DatabaseService,
    private http: HttpClient
  ) {

    this.platform.ready().then(() => {
      this.appState.getNetwork$
        .subscribe(hasConnection => {
          this.hasConnection = hasConnection;
          if (hasConnection) {
            this.dataToSync();
          }
        });

      this.appState.getDataChange$
        .subscribe(dataChanged => {
          if (dataChanged) {
            this.dataToSync();
          }
        });
    })
  }

  /**
   * Busca todos os dados que precisão de ser sincronizados
   */
  private dataToSync() {
    this.database.databaseState
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(async ready => {
        if (ready && this.hasConnection) {
          this.unsubscribe.next();
          try {
            const listContacts = await this.database.getAllContacts(false);
            if (listContacts.length > 0) {
              this.appState.setSyncState(true);
              console.log('dataToSync, true');
              this.sync(listContacts)
                .subscribe(async res => {
                  if (res.deleteLocalData) {
                    await this.database.deleteContacts();
                    this.createContacts(res.contacts);
                  } else {
                    this.updateContacts(res.contacts);
                  }
                  this.appState.setDataChange(false);
                  this.appState.setSyncState(false);
                  console.log('dataToSync, false');
                  await this.gAlert.presentToast('Contatos sincronizados com sucesso!', 'success');
                }, e => {
                  this.appState.setSyncState(false);
                  console.log('dataToSync, false');
                  this.gAlert.presentToastError('Ocorreu um erro ao sincronizar seus contatos');
                });
            } else {
              this.appState.setDataChange(false);
            }
          } catch (error) {
            this.gAlert.presentToastError('Ocorreu um erro ao sincronizar seus contatos');
          }
        }
      });
  }

  /**
   * Após realizar com sucesso o sincronismo dos dados com o servidor,
   * realiza a atualização dos dados locais, como já sincronizados
   * @param listContacts Lista de contatos
   */
  private updateContacts(listContacts: Array<Contact>) {
    listContacts.forEach(async contact => {
      await this.database.updateContact(contact.id, contact.idServer, contact.active, true, false);
    });
  }

  /**
   * Após realizar com sucesso o sincronismo dos dados com o servidor,
   * realiza a atualização dos dados locais, como já sincronizados
   * @param listContacts Lista de contatos
   */
  private createContacts(listContacts: Array<Contact>) {
    listContacts.forEach(async contact => {
      await this.database.addContact(contact, false);
    });
  }

  /**
   * Envia a linta de contatos não sincronizados para o servidor
   * @param contacts Lista de contatos
   */
  private sync(contacts: Array<Contact>): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.url, contacts).pipe(take(1));
  }

  getBkp(): Observable<Array<Contact>> {
    return this.http.get<Array<Contact>>(`${this.url}/bkp`).pipe(take(1));
  }
}
