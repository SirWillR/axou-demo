import { Component, ViewChild, ElementRef, NgZone, OnInit, Input } from '@angular/core';
import { MapaService } from 'src/app/services/mapa.service';
import { NavController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ItensService } from 'src/app/services/itens.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { OverlayService } from 'src/app/services/overlay.service';
import { MostraItemPage } from 'src/app/pages/mostra-item/mostra-item.page';

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
    private modalCtrl: ModalController,
    public ngZone: NgZone,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private itensService: ItensService,
    private geolocation: Geolocation,
    private overlayService: OverlayService
  ) {
    this.activatedRoute.queryParams.subscribe(async () => {
      if (this.router.getCurrentNavigation().extras.state) {
        const params = this.router.getCurrentNavigation().extras.state.params;
        const latLng = this.router.getCurrentNavigation().extras.state.latLng;
        if (params) {
          const loading = await this.overlayService.loading();
          this.itensService.setitens(params);
          await this.mapaService
            .reloadMap(this.mapElement, this.map.getZoom(), this.map.getCenter())
            .then(mapa => {
              this.map = mapa;
              this.addMapStatus();
            })
            .catch(erro => {
              this.overlayService.toast({
                message: 'Falha ao carregar o mapa: ' + erro
              });
            })
            .finally(() => {
              loading.dismiss();
            });
        }
        if (latLng) {
          this.mapaService.goToMap(this.map, latLng.lat, latLng.lng);
        }
      }
    });
  }

  async ngOnInit() {
    const loading = await this.overlayService.loading();
    await this.mapaService
      .loadMap(this.mapElement)
      .then(mapa => {
        this.map = mapa;
        this.addMapStatus();
      })
      .catch(erro => {
        this.overlayService.toast({
          message: 'Falha ao carregar o mapa: ' + erro
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async addMapStatus() {
    return new Promise(() => {
      this.mapaService.addSearchBox(this.map, this.pacInput);
      this.mapaService.addZoomControl(
        this.map,
        this.zoomControlElement,
        this.zoomInElement,
        this.zoomOutElement
      );
      this.itensService.getAll().subscribe(itens => {
        const locations = [];
        itens.map(item =>
          locations.push({
            id: item.id,
            title: item.titulo,
            descricao: item.descricao,
            latlng: item.latLng,
            situacao: item.situacao,
            tipo: item.tipo
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
    });
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
    this.modalCtrl
      .create({
        component: MostraItemPage,
        componentProps: {
          id
        }
      })
      .then(modal => modal.present());
    // this.navCtrl.navigateForward(['mostra-item', { id }]);
  }

  getParam(param: string) {
    return this.activatedRoute.snapshot.paramMap.get(param);
  }
}
