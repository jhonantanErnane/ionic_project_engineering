import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Platform, NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
    const sql = 'CREATE TABLE IF NOT EXISTS contacts(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT, photo TEXT, wasSync BOOLEAN, active BOOLEAN);';
    try {
      await this.database.executeSql(sql, []);
      this.dbReady.next(true);
    } catch (error) {
      await this.gAlert.presentAlertConfirm('Atenção!', 'Ocorreu um erro ao tentar inicializar o aplicativo, tente novamente.');
      navigator['app'].exitApp();
    }
  }

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
  get DatabaseState() {
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
   * Adicionar contato no banco
   * @param contact contato a ser adicionado no banco
   */
  async addContact(contact: Contact): Promise<GenericResponse> {
    const sql = `INSERT INTO ${this.TABLE_CONTACTS} (name, phone, photo, wasSync, active) VALUES('${contact.name}', '${contact.phone}', '${contact.photo}', ${false}, ${true})`;
    try {
      await this.aux(sql);
      this.appState.setDataChange(true);
      return {successful: true};
    } catch (error) {
      return {successful: false};
    }
  }

  /**
   * Atualizar contato
   * @param idContact id do contato
   * @param active contato ativo ou não
   * @param wasSync se o contato já foi sincronizado ou não
   */
  async updateContact(idContact: number, active: boolean, wasSync: boolean): Promise<GenericResponse> {
    const sql = `UPDATE ${this.TABLE_CONTACTS} SET active=${active}, wasSync=${wasSync} WHERE id=${idContact} `;
    try {
      await this.aux(sql);
      this.appState.setDataChange(true);
      return {successful: true} ;
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
      return error;
    }
  }


}
