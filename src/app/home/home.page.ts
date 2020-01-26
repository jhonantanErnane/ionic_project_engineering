import { Component, ViewChild } from '@angular/core';
import { Contact } from '../shared/models/contact';
import { DatabaseService } from '../shared/services/database.service';
import { GenericAlertService } from '../shared/services/generic-alert.service';
import { SyncService } from '../shared/services/sync.service';
import { LoadingComponent } from '../shared/components/loading/loading.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(LoadingComponent, { static: true }) loading: LoadingComponent;
  private listContacts = new Array<Contact>();
  resultContacts: Array<Contact>;
  constructor(
    private dbService: DatabaseService,
    private syncService: SyncService,
    private gAlert: GenericAlertService
  ) {
  }

  ionViewDidEnter() {
    this.dbService.DatabaseState.subscribe(async ready => {
      if (ready) {
        this.getContacts();
      }
    });
  }

  private async getContacts() {
    this.listContacts = await this.dbService.getAllContacts();
    this.resultContacts = this.listContacts;
  }

  async getBkp() {
    const resp = await this.gAlert.presentAlertYesNo('Atenção!', 'Esta ação irá apagar todos os contatos offline e irá buscar todos do servidor. Gostaria realmente de fazer isso?');
    if (resp) {
      try {
        await this.loading.showLoading();
        await this.dbService.deleteContacts();
        this.syncService.getBkp()
          .subscribe(async listContacts => {
            listContacts.forEach(async contact => {
              await this.dbService.addContact(contact);
            });
            await this.getContacts();
            this.loading.dismissLoading();
            this.gAlert.presentToastSuccess('Contatos recuperados com sucesso!');
          });
      } catch (error) {
        await this.gAlert.presentToastError('ocorreu um erro ao tentar restaurar seus contatos, tente novamente.');
        this.loading.dismissLoading();
      }
    }
  }

  async onSearch(event: any) {
    const text: string = event.detail.value;
    if (text !== '') {
      this.resultContacts = this.listContacts.filter(contact => contact.name.toLowerCase().includes(text.toLowerCase()));
    } else {
      this.resultContacts = this.listContacts;
    }
  }

  async removeContact(contactId: number) {
    const contact = this.resultContacts.filter(contact => contact.id === contactId)[0];
    await this.dbService.updateContact(contact.id, false, false);
    this.getContacts();
  }

  // async addDatabase() {
  //   // this.listContacts = await this.dbService.addContact(this.c);
  //   // this.listContacts = await this.dbService.deleteContacts(1);
  //   // this.listContacts = await this.dbService.searchContacts('a');
  //   console.log(this.listContacts);

  // }

}
