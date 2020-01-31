import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Estado da Aplicação
 */
export class AppStateService {

  /**
   * Gerência de estado da conexão
   */
  private network$ = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('network')));
  /**
   * Obter o estado da conexão
   */
  getNetwork$ = this.network$.asObservable();

  /**
   * Gerência de estado dos dados no banco local
   */
  private dataChange$ = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('datachange')));
  /**
   * Obter quando é necessário fazer o sincronismo com o banco de dados na nuvem
   */
  getDataChange$ = this.dataChange$.asObservable();

  /**
   * Gerência do estado do sincronismo
   */
  private syncState$ = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('sync')));
  /**
   * Obter o estado do sincronismo
   */
  getSyncState$ = this.syncState$.asObservable();

  constructor() { }

  /**
   * Muda o estado da conexão
   * @param status status da conexão, true se tiver conexão, e false se não tiver conexão
   */
  setNetwork(status: boolean) {
    localStorage.setItem('network', JSON.stringify(status));
    this.network$.next(status);
  }

  /**
   * Muda o estado do sincronismo
   * @param status status do sincronismo, true se estiver fazendo sincronismo, e false se não estiver sincronizando
   */
  setSyncState(status: boolean) {
    localStorage.setItem('sync', JSON.stringify(status));
    this.syncState$.next(status);
  }

  /**
   * Muda o estado dos dados locais para upload
   * @param datachanged se houve alteração nos dados locais, true se teve alteração, e false se não teve alteração
   */
  setDataChange(datachanged: boolean) {
    localStorage.setItem('datachange', JSON.stringify(datachanged));
    this.dataChange$.next(datachanged);
  }
}
