import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItensService } from 'src/app/services/itens.service';
import { ItemClass } from 'src/app/shared/item.model';
import { MapaService } from 'src/app/services/mapa.service';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mostra-item',
  templateUrl: './mostra-item.page.html',
  styleUrls: ['./mostra-item.page.scss']
})
export class MostraItemPage implements OnInit {
  item: any = {
    titulo: '',
    descricao: '',
    tipo: '',
    situacao: '',
    data: { seconds: 0, nano: 0 },
    data_formatada: '',
    cidade: '',
    uf: '',
    pais: '',
    id: '',
    latLng: { lag: 0, lng: 0 }
  };
  imgItem: any;

  constructor(
    private navParams: NavParams,
    private itensService: ItensService,
    private mapaService: MapaService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.itensService.get(this.navParams.get('id')).subscribe(item => {
      this.item = item;
      this.item.data_formatada = this.dataAtualFormatada(new Date(this.item.data.seconds * 1000));
      this.imgItem = 'assets/img/itens/' + this.mapaService.getItemType(item.tipo) + '.png';
    });
  }

  dataAtualFormatada(data: any) {
    const dia = data.getDate().toString();
    const diaF = dia.length === 1 ? '0' + dia : dia;
    const mes = (data.getMonth() + 1).toString(); // +1 pois no getMonth Janeiro começa com zero.
    const mesF = mes.length === 1 ? '0' + mes : mes;
    const anoF = data.getFullYear();
    return diaF + '/' + mesF + '/' + anoF;
  }

  fechar() {
    this.modalCtrl.dismiss();
  }
}
