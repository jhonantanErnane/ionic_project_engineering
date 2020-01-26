import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ContactTileModule } from '../shared/components/contact-tile/contact-tile.module';
import { LoadingModule } from '../shared/components/loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactTileModule,
    LoadingModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      },
      {
        path: 'add-contact',
        loadChildren: () => import('./add-contact/add-contact.module').then( m => m.AddContactPageModule)
      }
    ])
  ],
  declarations: [
    HomePage
  ]
})
export class HomePageModule {}
