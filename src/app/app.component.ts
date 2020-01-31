import { Component, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NetworkService } from './shared/services/network.service';
import { SyncService } from './shared/services/sync.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppStateService } from './shared/services/appstate.service';
import { LoadingComponent } from './shared/components/loading/loading.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  private unsub = new Subject<any>();
  @ViewChild(LoadingComponent, { static: true }) loading: LoadingComponent;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private appState: AppStateService,
    private statusBar: StatusBar,
    private netWorkService: NetworkService,
    private syncService: SyncService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      
      this.appState.getSyncState$
      .pipe(takeUntil(this.unsub))
      .subscribe(async isSync => {
        if (isSync) {
          console.log('showLoading');
          
          await this.loading.showLoading('Sincronizando dados...');
        } else {
          console.log('dismissLoading');
          
          this.loading.dismissLoading();
        }
      });

    });
  }
}
