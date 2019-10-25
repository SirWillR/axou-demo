import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapaService } from '../../services/mapa.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, UrlSegmentGroup, UrlSegment, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  @ViewChild('map', { read: ElementRef, static: true }) mapElement: ElementRef;
  @ViewChild('zoomControl', { read: ElementRef, static: true }) zoomControlElement: ElementRef;
  @ViewChild('zoomOut', { read: ElementRef, static: true }) zoomOutElement: ElementRef;
  @ViewChild('zoomIn', { read: ElementRef, static: true }) zoomInElement: ElementRef;
  @ViewChild('pacInput', { read: ElementRef, static: true }) pacInputElement: ElementRef;
  @ViewChild('actionButton', { read: ElementRef, static: true }) actionButton: ElementRef;
  map: any;
  activeInfoWindow: any;

  constructor(
    private mapaService: MapaService,
    private navCtrl: NavController,
    public ngZone: NgZone,
    private activatedRoute: ActivatedRoute
  ) {}

  ionViewDidEnter() {
    console.log(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadMap();
  }

  async loadMap() {
    await this.mapaService.loadMap(this.mapElement).then(mapa => (this.map = mapa));
    this.mapaService.addSearchBox(this.map, this.pacInputElement);
    this.mapaService.addActionButton(this.map, this.actionButton);
    this.mapaService.addZoomControl(
      this.map,
      this.zoomControlElement,
      this.zoomInElement,
      this.zoomOutElement
    );

    const locations = [
      {
        latlng: { lat: -31.56391, lng: 147.154312 },
        id: '1',
        title: 'Titulo',
        descricao: 'Descricao'
      }
    ];
    this.activeInfoWindow = this.mapaService.showItens(
      this.map,
      locations,
      ((window as any).ionicPageRef = {
        zone: this.ngZone,
        component: this
      })
    );
  }

  showItemInfo(id: string) {
    alert(id);
  }

  formPesquisar() {
    this.navCtrl.navigateForward(['pesquisar']);
  }
}
