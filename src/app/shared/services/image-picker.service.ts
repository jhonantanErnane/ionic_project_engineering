import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Injectable({
  providedIn: 'root'
})
export class ImagePickerService {

  constructor(private camera: Camera) { }

  /**
   * Obter imagem da galeria ou da camera
   * @param sourceType 'CAMERA' ou 'PHOTOLIBRARY'
   */
  getImage(sourceType?: string): Promise<{ photo: string }> {
    return new Promise((resolve, reject) => {
      let pictureSourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
      if (sourceType && sourceType === 'CAMERA') {
        pictureSourceType = this.camera.PictureSourceType.CAMERA;
      }
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: pictureSourceType,
        targetHeight: 180,
        targetWidth: 180,
        saveToPhotoAlbum: false
      };

      this.camera.getPicture(options).then((imageData) => {
        resolve({ photo: 'data:image/jpeg;base64,' + imageData});
      }, (err) => {
        reject('falha ao tentar obter imagens');
      });
    });
  }

}
