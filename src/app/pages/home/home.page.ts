import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapaService } from '../../services/mapa.service';
import { NavController } from '@ionic/angular';

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
    public ngZone: NgZone
  ) {}

  ionViewDidEnter() {
    this.loadMap();
  }

  async loadMap() {
    await this.mapaService.loadMap(this.mapElement).then(map => (this.map = map));
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
      },
      {
        latlng: { lat: -33.718234, lng: 150.363181 },
        id: '2',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -33.727111, lng: 150.371124 },
        id: '3',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -33.848588, lng: 151.209834 },
        id: '4',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -33.851702, lng: 151.216968 },
        id: '5',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -34.671264, lng: 150.863657 },
        id: '6',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -35.304724, lng: 148.662905 },
        id: '7',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -36.817685, lng: 175.699196 },
        id: '8',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -36.828611, lng: 175.790222 },
        id: '9',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -37.75, lng: 145.116667 },
        id: '10',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -37.759859, lng: 145.128708 },
        id: '11',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -37.765015, lng: 145.133858 },
        id: '12',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -37.770104, lng: 145.143299 },
        id: '13',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -37.7737, lng: 145.145187 },
        id: '14',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -37.774785, lng: 145.137978 },
        id: '15',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -37.819616, lng: 144.968119 },
        id: '16',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -38.330766, lng: 144.695692 },
        id: '17',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -39.927193, lng: 175.053218 },
        id: '18',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -41.330162, lng: 174.865694 },
        id: '19',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -42.734358, lng: 147.439506 },
        id: '20',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -42.734358, lng: 147.501315 },
        id: '21',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -42.735258, lng: 147.438 },
        id: '22',
        title: 'Titulo',
        descricao: 'Descricao'
      },
      {
        latlng: { lat: -43.999792, lng: 170.463352 },
        id: '23',
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
