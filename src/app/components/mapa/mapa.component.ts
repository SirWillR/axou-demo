import { Component, ViewChild, ElementRef, NgZone, OnInit, Input } from '@angular/core';
import { MapaService } from 'src/app/services/mapa.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ItensService } from 'src/app/services/itens.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { OverlayService } from 'src/app/services/overlay.service';

declare var google;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  @Input() pacInput: any;
  @Input() itens: any;

  @ViewChild('map', { read: ElementRef, static: true }) mapElement: ElementRef;
  @ViewChild('zoomControl', { read: ElementRef, static: true }) zoomControlElement: ElementRef;
  @ViewChild('zoomOut', { read: ElementRef, static: true }) zoomOutElement: ElementRef;
  @ViewChild('zoomIn', { read: ElementRef, static: true }) zoomInElement: ElementRef;

  map: any;
  activeInfoWindow: any;

  constructor(
    private mapaService: MapaService,
    private navCtrl: NavController,
    public ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private itensService: ItensService,
    private geolocation: Geolocation,
    private overlayService: OverlayService
  ) {}

  ngOnInit() {
    this.loadMap();
  }

  async loadMap() {
    const loading = await this.overlayService.loading();
    await this.mapaService
      .loadMap(this.mapElement)
      .then(mapa => {
        if (!mapa) {
          throw new Error('Falha ao carregar o mapa');
        }
        this.map = mapa;
        this.mapaService.addSearchBox(this.map, this.pacInput);
        this.mapaService.addZoomControl(
          this.map,
          this.zoomControlElement,
          this.zoomInElement,
          this.zoomOutElement
        );
        this.showItensMarker();
        this.goToMap();
      })
      .catch(err => {
        this.overlayService.toast({
          message: err
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  private goToMap() {
    if (this.getParam('lat') != null && this.getParam('lng') != null) {
      this.mapaService.goToMap(this.map, this.getParam('lat'), this.getParam('lng'));
    }
  }

  showItensMarker() {
    try {
      this.itensService.setitens({
        tipo: this.getParam('tipo') != null ? this.getParam('tipo') : null,
        dataInicio: this.getParam('data_inicio') != null ? this.getParam('data_inicio') : null,
        dataFim: this.getParam('data_fim') != null ? this.getParam('data_fim') : null,
        situacao: this.getParam('situacao') != null ? this.getParam('situacao') : null
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
      .then(resp => {
        this.map.panTo(new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude));
        this.map.setZoom(15);
      })
      .catch(err => {
        this.overlayService.toast({
          message: err
        });
      });
  }

  showItemInfo(id: string) {
    this.navCtrl.navigateForward(['mostra-item', { id }]);
  }

  getParam(param: string) {
    return this.activatedRoute.snapshot.paramMap.get(param);
  }
}
