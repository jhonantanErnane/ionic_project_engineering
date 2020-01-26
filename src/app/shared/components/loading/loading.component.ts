import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {

  private cont = 0;

  private loadingRef: HTMLIonLoadingElement;

  constructor(
    private loadingController: LoadingController
    ) { }

  /**
   * `msgLoading` optional, default value 'Carregando...'
   */
  async showLoading(msgLoading?: string) {
    this.cont++;
    await this.beforePresentLoading(msgLoading);
  }

  dismissLoading() {
    this.cont--;
    this.cont = this.cont < 0 ? 0 : this.cont;
    if (this.cont === 0 && this.loadingRef) {
      this.loadingRef.dismiss();
      this.loadingRef = undefined;
    }
    // console.log('this.cont ', this.cont);

  }

  private async beforePresentLoading(msgLoading: string) {
    // console.log(this.loadingRef);

    if (this.loadingRef) {
      this.loadingRef.message = msgLoading;
    } else {
      await this.presentLoadingWithOptions(msgLoading);
    }
  }

  private async presentLoadingWithOptions(msgLoading?: string) {
    this.loadingRef = await this.loadingController.create({
      message: msgLoading ? msgLoading : 'Carregando',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await this.loadingRef.present();
  }

}
