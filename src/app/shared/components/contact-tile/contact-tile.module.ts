import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactTileComponent } from './contact-tile.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    ContactTileComponent
  ],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    ContactTileComponent
  ]
})
export class ContactTileModule { }
