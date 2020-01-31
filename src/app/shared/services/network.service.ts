import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { debounce } from 'rxjs/operators';
import { interval } from 'rxjs';
import { AppStateService } from './appstate.service';
import { ConnectionEnum } from '../enums/connection';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(
    private appStateService: AppStateService,
    private network: Network,
    private plt: Platform
  ) {
    this.plt.ready().then(() => {
      this.observeStatusNet();
      this.init();
    });
  }

  /**
   * Informa a situação atual da conexão na primeira vez
   */
  private init() {
    this.appStateService.setNetwork(this.network.type !== 'none' ? true : false);
  }

  /**
   * Metodo para inicializar a observação da conexão de internet
   * Quando houver alteração na conexão, espera 1 segundo para ter certeza que a conexão realmente ocorreu
   * e notifica a aplicação
   */
  private observeStatusNet() {
    this.network.onChange()
      .pipe(debounce(() => interval(1000)))
      .subscribe(connection => {
        this.appStateService.setNetwork(connection.type === ConnectionEnum.online ? true : false);
      });
  }
}
