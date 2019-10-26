import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapaService } from '../../services/mapa.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { ItensService } from 'src/app/services/itens.service';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss']
})
export class MapPage {
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
    private activatedRoute: ActivatedRoute,
    private itensService: ItensService,
    private geolocation: Geolocation
  ) {}

  ionViewDidEnter() {
    if (!this.map) {
      this.loadMap();
    }
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
    this.showItensMarker();
  }

  async showItensMarker(): Promise<void> {
    try {
      this.itensService.setitens({
        tipo:
          this.activatedRoute.snapshot.paramMap.get('tipo') != null
            ? this.activatedRoute.snapshot.paramMap.get('tipo')
            : null,
        dataInicio:
          this.activatedRoute.snapshot.paramMap.get('data_inicio') != null
            ? this.activatedRoute.snapshot.paramMap.get('data_inicio')
            : null,
        dataFim:
          this.activatedRoute.snapshot.paramMap.get('data_fim') != null
            ? this.activatedRoute.snapshot.paramMap.get('data_fim')
            : null,
        situacao:
          this.activatedRoute.snapshot.paramMap.get('situacao') != null
            ? this.activatedRoute.snapshot.paramMap.get('situacao')
            : null
      });
      this.itensService.getAll().subscribe(itens => {
        const locations = [];
        itens.map(x =>
          locations.push({
            id: x.id,
            title: x.titulo,
            descricao: x.descricao,
            latlng: x.latLng,
            situacao: x.situacao
          })
        );
        this.activeInfoWindow = this.mapaService.showItens(
          this.map,
          locations,
          ((window as any).ionicPageRef = {
            zone: this.ngZone,
            component: this
          })
        );
      });
    } catch (error) {
      console.log('Erro ao carregar os itens: ', error);
    }
  }

  goLocMap() {
    this.geolocation
      .getCurrentPosition()
      .then(resp =>
        this.map.panTo(new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude))
      );
  }

  showItemInfo(id: string) {
    this.navCtrl.navigateForward(['mostra-item', { id }]);
  }

  formPesquisar() {
    this.navCtrl.navigateForward(['pesquisar']);
  }
}