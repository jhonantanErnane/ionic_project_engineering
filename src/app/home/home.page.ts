import { Component, OnDestroy } from '@angular/core';
import { Contact } from '../shared/models/contact';
import { DatabaseService } from '../shared/services/database.service';
import { GenericAlertService } from '../shared/services/generic-alert.service';
import { SyncService } from '../shared/services/sync.service';
import { AppStateService } from '../shared/services/appstate.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
  resultContacts: Array<Contact>;
  private listContacts = new Array<Contact>();
  private unsub = new Subject<any>();
  private hasConnection: boolean;
  private isSync: boolean;
  private dbIsReady: boolean;
  private hasBackup = true;

  constructor(
    private dbService: DatabaseService,
    private appState: AppStateService,
    private syncService: SyncService,
    private gAlert: GenericAlertService
  ) {

    // Escuta as alterações de rede para poder ou não obter os contatos
    this.appState.getNetwork$
      .pipe(takeUntil(this.unsub))
      .subscribe(hasConnection => this.hasConnection = hasConnection);

    // Escuta o estado da sincronização
    this.appState.getSyncState$
      .pipe(takeUntil(this.unsub))
      .subscribe(isSync => {
        // se não estiver fazendo sincronismo,
        // e o valor do sincronismo for diferente do anterior já armazenado
        // chama a função para obter os contatos locais
        if (!isSync && isSync !== this.isSync) {
          this.isSync = isSync;
          this.getContacts();
        }
        this.isSync = isSync;
      });

    // escuta o estado do BD local, estando pronto
    // chama a função para obter os contatos locais
    this.dbService.databaseState
      .pipe(takeUntil(this.unsub))
      .subscribe(async ready => {
        this.dbIsReady = ready;
        if (ready) {
          this.getContacts();
        }
      });
  }

  // Toda vez que entrar na pagina home, solicita a atualização local dos contatos
  ionViewDidEnter() {
    if (this.dbIsReady) {
      this.getContacts();
    }
  }

  /**
   * Obtem os contatos locais, e atualiza a lista na tela
   */
  private async getContacts() {
    if (!this.isSync) {
      this.listContacts = await this.dbService.getAllContacts();
      if (this.hasConnection) {
        if (this.listContacts && this.listContacts.length === 0 && this.hasBackup) {
          this.appState.setSyncState(true); // Liga o loading do sincronismo
          this.getBkp();
        }
      }
      this.resultContacts = this.listContacts;
    }
  }

  /**
   * Obtem o backup do servidor
   */
  private async getBkp() {
    if (this.hasBackup) {
      this.syncService.getBkp() // Busca o backup do servidor
        .subscribe(async listContacts => {

          if (listContacts.length > 0) {
            // Para cada contato trago na chamada salva no banco de dados local
            listContacts.forEach(async contact => {
              await this.dbService.addContact(contact, false);
            });
            // Atualiza os contatos na tela
            this.appState.setSyncState(false); // Desliga o loading do sincronismo
            await this.getContacts();
            this.gAlert.presentToast('Contatos sincronizados com sucesso!', 'success'); // feedback ao usuário
          } else {
            this.hasBackup = false;
            this.appState.setSyncState(false); // Desliga o loading do sincronismo
          }
        }, e => {
          this.appState.setSyncState(false); // Desliga o loading do sincronismo
          this.gAlert.presentToastError('Ocorreu um erro ao sincronizar seus contatos'); // feedback ao usuário
        });
    }
  }

  /**
   * Cada letra que o usuário digitar irá chamar essa função
   * @param event Evento disparado pelo component do ionic, contendo o texto digitado
   */
  async onSearch(event: any) {
    const text: string = event.detail.value;
    if (text !== '') {
      this.resultContacts = this.listContacts.filter(contact => contact.name.toLowerCase().includes(text.toLowerCase()));
    } else {
      this.resultContacts = this.listContacts;
    }
  }

  /**
   * Remove um usuário da lista, e já atualiza a lista na tela
   * @param contactId ID do contato
   */
  async removeContact(contactId: number) {
    const contact = this.resultContacts.filter(contact => contact.id === contactId)[0];
    await this.dbService.updateContact(contact.id, contact.idServer, false, false, true);
    this.getContacts();
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }
}
