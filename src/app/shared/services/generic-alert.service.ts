import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ToastOptions, AlertOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class GenericAlertService {

  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) {
  }


  async presentAlertConfirm(header: string, message: string) {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => resolve()
          }
        ]
      });
      await alert.present();
    });
  }

  presentAlertYesNo(header: string, message: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: [
          {
            text: 'NÃO',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => resolve(false)
          },
          {
            text: 'SIM',
            cssClass: 'secondary',
            handler: () => resolve(true)
          }
        ]
      });
      await alert.present();
    });
  }


  chooseImageSource(header: string, message: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header,
        message,
        cssClass: 'alertMenor',
        buttons: [
          {
            text: 'Galeria',
            cssClass: 'secondary',
            handler: () => resolve('PHOTOLIBRARY')
          },
          {
            text: 'Camera',
            cssClass: 'secondary',
            handler: () => resolve('CAMERA')
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => resolve()
          }
        ]
      });
      await alert.present();
    });
  }

  async presentToastSuccess(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }

  async presentToastError(msg: string, withButton?: boolean, msgButton?: string) {
    const options: ToastOptions = {
      message: msg,
      duration: 3000,
      color: 'danger'
    };
    if (withButton) {
      options.showCloseButton = true;
      options.closeButtonText = msgButton;
      options.duration = 0;
    }
    const toast = await this.toastController.create(options);
    toast.present();
    return toast;
  }
}
