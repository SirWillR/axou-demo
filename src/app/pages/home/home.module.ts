import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      { path: 'map', loadChildren: '../map/map.module#MapPageModule' },
      { path: 'lista', loadChildren: '../lista/lista.module#ListaPageModule' },
    ]
  },
  {
    path: '',
    redirectTo: 'home/map',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  declarations: [HomePage]
})
export class HomePageModule {}
