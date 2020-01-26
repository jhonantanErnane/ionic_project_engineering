import { Injectable } from '@angular/core';
import { AppStateService } from './appstate.service';
import { DatabaseService } from './database.service';
import { Contact } from '../models/contact';
import { HttpClient } from '@angular/common/http';
import { take, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private readonly url = `${environment.urlApi}/contacts`;
  private unsubscribe = new Subject<any>();
  private hasConnection: boolean;
  constructor(
    private appState: AppStateService,
    private database: DatabaseService,
    private http: HttpClient
  ) {
    this.appState.getNetwork$
      .subscribe(hasConnection => {
        this.hasConnection = hasConnection;
        console.log(hasConnection);
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
  }

  /**
   * Busca todos os dados que precisão de ser sincronizados
   */
  private dataToSync() {
    this.database.DatabaseState
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(async ready => {
        if (ready && this.hasConnection) {
          this.unsubscribe.next();
          try {
            const listContacts = await this.database.getAllContacts(false);
            if (listContacts.length > 0) {
              this.sync(listContacts)
                .subscribe(res => {
                  this.updateContacts(listContacts);
                  this.appState.setDataChange(false);
                }, e => {
                });
            } else {
              this.appState.setDataChange(false);
            }
          } catch (error) {
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
      await this.database.updateContact(contact.id, contact.active, true);
    });
  }

  /**
   * Manda a linta de contatos não sincronizados para o servidor
   * @param contacts Lista de contatos
   */
  private sync(contacts: Array<Contact>) {
    return this.http.post(this.url, contacts).pipe(take(1));
  }

  getBkp(): Observable<Array<Contact>> {
    return this.http.get<Array<Contact>>(`${this.url}/bkp`).pipe(take(1));
  }
}
