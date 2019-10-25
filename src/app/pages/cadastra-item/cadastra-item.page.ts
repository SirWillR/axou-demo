import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MapaService } from 'src/app/services/mapa.service';
import * as moment from 'moment';
import { ItensService } from 'src/app/services/itens.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-cadastra-item',
  templateUrl: './cadastra-item.page.html',
  styleUrls: ['./cadastra-item.page.scss']
})
export class CadastraItemPage implements OnInit {
  @ViewChild('map', { read: ElementRef, static: true }) mapElement: ElementRef;
  @ViewChild('zoomControl', { read: ElementRef, static: true }) zoomControlElement: ElementRef;
  @ViewChild('zoomOut', { read: ElementRef, static: true }) zoomOutElement: ElementRef;
  @ViewChild('zoomIn', { read: ElementRef, static: true }) zoomInElement: ElementRef;
  @ViewChild('pacInput', { read: ElementRef, static: true }) pacInputElement: ElementRef;
  map: any;
  cadastroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private mapaService: MapaService,
    private itensService: ItensService
  ) {}

  ngOnInit() {
    this.loadMap();
    this.createForm();
  }

  private createForm(): void {
    this.cadastroForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(6)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      tipo: ['', [Validators.required]],
      situacao: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      latLng: ['', [Validators.required]],
      data: [moment().format('YYYY-MM-DD'), [Validators.required]]
    });
  }

  get titulo(): FormControl {
    return this.cadastroForm.get('titulo') as FormControl;
  }

  get descricao(): FormControl {
    return this.cadastroForm.get('descricao') as FormControl;
  }

  get tipo(): FormControl {
    return this.cadastroForm.get('tipo') as FormControl;
  }

  get situacao(): FormControl {
    return this.cadastroForm.get('situacao') as FormControl;
  }

  get cidade(): FormControl {
    return this.cadastroForm.get('cidade') as FormControl;
  }

  get uf(): FormControl {
    return this.cadastroForm.get('uf') as FormControl;
  }

  get pais(): FormControl {
    return this.cadastroForm.get('pais') as FormControl;
  }

  get latLng(): FormControl {
    return this.cadastroForm.get('latLng') as FormControl;
  }

  get data(): FormControl {
    return this.cadastroForm.get('data') as FormControl;
  }

  async loadMap() {
    await this.mapaService.loadMap(this.mapElement).then(mapa => (this.map = mapa));
    this.mapaService.addSearchBox(this.map, this.pacInputElement);
    this.mapaService.addZoomControl(
      this.map,
      this.zoomControlElement,
      this.zoomInElement,
      this.zoomOutElement
    );
    this.mapaService.markerClick(this.map, this.cidade, this.uf, this.pais, this.latLng);
  }

  onSubmit() {
    const data = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    this.data.setValue(firebase.firestore.Timestamp.fromDate(data));
    this.latLng.setValue(JSON.parse(this.latLng.value));
    this.itensService.create(this.cadastroForm.value);
  }
}
