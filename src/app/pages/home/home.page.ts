import { Component, ViewChild, ElementRef } from '@angular/core';
import { MapaService } from '../../services/mapa.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  @ViewChild('map', { read: ElementRef, static: true }) mapElement: ElementRef;
  @ViewChild('pacInput', { read: ElementRef, static: true }) pacInputElement: ElementRef;
  map: any;

  constructor(private mapaService: MapaService) {}

  ionViewDidEnter() {
    this.loadMap();
  }

  async loadMap() {
    await this.mapaService.loadMap(this.mapElement).then(map => (this.map = map));
    this.mapaService.showItens(this.map);
    this.mapaService.addSearchBox(this.map, this.pacInputElement);
    this.mapaService.markerClick(this.map);
  }
}
