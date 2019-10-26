import { Component, OnInit } from '@angular/core';
import { ItensService } from 'src/app/services/itens.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss']
})
export class ListaPage implements OnInit {
  locations: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private itensService: ItensService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.showItensMarker();
  }

  showItensMarker() {
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
        this.locations = [];
        itens.map(x =>
          this.locations.push({
            id: x.id,
            title: x.titulo,
            descricao: x.descricao,
            latlng: x.latLng,
            situacao: x.situacao
          })
        );
      });
    } catch (error) {
      console.log('Erro ao carregar os itens: ', error);
    }
  }

  goToMap(latlng: any) {
    const lat = latlng.lat;
    const lng = latlng.lng;
    this.navCtrl.navigateBack([
      'home/map',
      {
        tipo: this.activatedRoute.snapshot.paramMap.get('tipo'),
        dataInicio: this.activatedRoute.snapshot.paramMap.get('data_inicio'),
        dataFim: this.activatedRoute.snapshot.paramMap.get('data_fim'),
        situacao: this.activatedRoute.snapshot.paramMap.get('situacao'),
        lat,
        lng
      }
    ]);
  }
}
