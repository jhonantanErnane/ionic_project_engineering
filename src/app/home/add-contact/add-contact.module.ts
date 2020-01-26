import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddContactPage } from './add-contact.page';
import { RouterModule } from '@angular/router';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrMaskerModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: AddContactPage
      },
    ])
  ],
  declarations: [
    AddContactPage
  ]
})
export class AddContactPageModule {}
