import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Contact } from '../models/contact';
import { GenericResponse } from '../models/generic.response';
import { AppStateService } from './appstate.service';
import { GenericAlertService } from './generic-alert.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private readonly TABLE_CONTACTS = 'contacts';
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqLite: SQLite,
    private appState: AppStateService,
    private gAlert: GenericAlertService,
  ) {

    /**
     * Aguarda a plataforma ficar pronta, para inicializar o banco local
     */
    this.platform.ready().then(() => {
      this.sqLite.create({
        name: 'phonebook.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        // this.seedDatabase();
        this.initDB();
      });
    });
  }

  /**
   * Inicializa o banco de dados
   */
  private async initDB() {
    const sql = 'CREATE TABLE IF NOT EXISTS contacts(id INTEGER PRIMARY KEY AUTOINCREMENT, idServer TEXT, name TEXT, phone TEXT, photo TEXT, wasSync BOOLEAN, active BOOLEAN);';
    try {
      await this.database.executeSql(sql, []);
      this.dbReady.next(true);
    } catch (error) {
      await this.gAlert.presentAlertConfirm('Atenção!', 'Ocorreu um erro ao tentar inicializar o aplicativo, tente novamente.');
      navigator['app'].exitApp();
    }
  }

  /**
   * Deleta TODOS os contatos localmente
   */
  async deleteContacts() {
    const sql = `DELETE FROM ${this.TABLE_CONTACTS}`;
    try {
      await this.aux(sql);
    } catch (error) {
      return error;
    }
  }

  /**
   * Obtem o status do banco, se está pronto ou não
   */
  get databaseState() {
    return this.dbReady.asObservable();
  }

  /**
   * Obter todos os contatos
   * @param wasSync se deseja obter contatos somente não sincronizados
   */
  async getAllContacts(wasSync?: boolean): Promise<Array<Contact>> {
    let sql = '';
    if (wasSync !== undefined) {
      sql = `SELECT * FROM ${this.TABLE_CONTACTS} WHERE wasSync = ${wasSync} `;
    } else {
      sql = `SELECT * FROM ${this.TABLE_CONTACTS} WHERE active = ${true}`;
    }
    try {
      return await this.aux(sql);
    } catch (error) {
      return error;
    }
  }

  /**
   * Adicionar contato no banco local
   * @param contact contato a ser adicionado no banco
   */
  async addContact(contact: Contact, setDataChange = true): Promise<GenericResponse> {
    const sql = `INSERT INTO ${this.TABLE_CONTACTS} (idServer, name, phone, photo, wasSync, active) VALUES('${contact.idServer ? contact.idServer : null}', '${contact.name}', '${contact.phone}', '${contact.photo}', ${contact.wasSync ? contact.wasSync : false}, ${((contact.active == 0) || (contact.active == 1)) ? contact.active : true})`;
    try {
      await this.aux(sql);
      this.appState.setDataChange(setDataChange);
      return { successful: true };
    } catch (error) {
      return { successful: false };
    }
  }

  /**
   * Atualizar contato
   * @param idContact id do contato
   * @param active contato ativo ou não
   * @param wasSync se o contato já foi sincronizado ou não
   */
  async updateContact(idContact: number, idServer: string, active: boolean | number, wasSync: boolean, dataChange: boolean): Promise<GenericResponse> {
    const sql = `UPDATE ${this.TABLE_CONTACTS} SET active=${active}, wasSync=${wasSync}, idServer='${idServer}' WHERE id=${idContact} `;
    try {
      await this.aux(sql);
      this.appState.setDataChange(dataChange);
      return { successful: true };
    } catch (error) {
      return error;
    }
  }

  /**
   * Método auxiliar para executar os scripts sql
   * @param sql string contendo o script sql
   */
  private async aux(sql: string): Promise<Array<Contact>> {
    const contacts = new Array<Contact>();
    try {
      let data = await this.database.executeSql(sql, []);
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          const contact: Contact = data.rows.item(i);
          contacts.push(contact);
        }
      }
      return contacts;
    } catch (error) {
      console.log(error);
      return error;
    }
  }


}
