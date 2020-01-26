import { Component, OnInit } from '@angular/core';
import { ImagePickerService } from 'src/app/shared/services/image-picker.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PhoneValidator } from 'src/app/shared/validators/phone-validator';
import { GenericAlertService } from 'src/app/shared/services/generic-alert.service';
import { Contact } from 'src/app/shared/models/contact';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],
})
export class AddContactPage implements OnInit {
  form: FormGroup;

  imgProfile: {
    photo: string
  };

  constructor(
    private gAlert: GenericAlertService,
    private dbService: DatabaseService,
    private navController: NavController,
    private imageService: ImagePickerService) {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      imgUrl: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required, PhoneValidator.validCountryPhone()]),
    });
  }

  ngOnInit() {
  }

  async galeryOrCamera() {
    const resp = await this.gAlert.chooseImageSource('', 'Onde gostaria de obter a imagem?');
    if (resp) {
      this.getImage(resp);
    }
  }

  private getImage(source?: string) {
    this.imageService.getImage(source)
      .then(img => {
        this.imgProfile = img;
        this.form.get('imgUrl').setValue(img.photo);
      }, err => {
        console.error(err);
      });
  }

  submit() {
    const contact: Contact = {
      name: this.form.get('name').value,
      photo: this.form.get('imgUrl').value,
      phone: this.form.get('phone').value,
    };
    this.dbService.addContact(contact)
      .then(async resp => {
        if (resp.successful) {
          await this.gAlert.presentToastSuccess('Novo contato salvo com sucesso!');
          this.navController.pop();
        } else {
          await this.gAlert.presentToastError('Ocorreu um erro ao salvar o contato');
        }
      });
  }

}
