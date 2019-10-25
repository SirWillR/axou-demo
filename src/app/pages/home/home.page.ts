import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapaService } from '../../services/mapa.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, UrlSegmentGroup, UrlSegment, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItensService } from 'src/app/services/itens.service';

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
    private activatedRoute: ActivatedRoute,
    private itensService: ItensService
  ) {}

  ionViewDidEnter() {
    this.loadMap();
    this.showItensMarker();
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
  }

  async showItensMarker(): Promise<void> {
    try {
      /*
      this.itensService.setitens({
        titulo: this.activatedRoute.snapshot.paramMap.get('titulo'),
        descricao: this.activatedRoute.snapshot.paramMap.get('descricao'),
        tipo: this.activatedRoute.snapshot.paramMap.get('tipo'),
        data_inicio: this.activatedRoute.snapshot.paramMap.get('data_inicio'),
        data_fim: this.activatedRoute.snapshot.paramMap.get('data_fim'),
        situacao: this.activatedRoute.snapshot.paramMap.get('situacao')
      });
      */
      await this.itensService.getAll().subscribe(itens => {
        const locations = [];
        itens.map(x =>
          locations.push({
            id: x.id,
            title: x.titulo,
            descricao: x.descricao,
            latlng: x.latLng
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

  showItemInfo(id: string) {
    alert(id);
  }

  formPesquisar() {
    this.navCtrl.navigateForward(['pesquisar']);
  }
}
