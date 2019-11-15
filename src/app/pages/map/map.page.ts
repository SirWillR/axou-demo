import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss']
})
export class MapPage {
  @ViewChild('pacInput', { read: ElementRef, static: true }) pacInputElement: ElementRef;
  constructor(private navCtrl: NavController) {}

  formPesquisar() {
    this.navCtrl.navigateForward(['pesquisar']);
  }
}
