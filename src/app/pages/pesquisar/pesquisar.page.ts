import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-pesquisar',
  templateUrl: './pesquisar.page.html',
  styleUrls: ['./pesquisar.page.scss']
})
export class PesquisarPage implements OnInit {
  searchForm: FormGroup;

  constructor(private fb: FormBuilder, private navCtrl: NavController) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm(): void {
    this.searchForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(6)]],
      descricao: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      data_inicio: ['', [Validators.required]],
      data_fim: ['', [Validators.required]],
      situacao: ['', [Validators.required]]
    });
  }

  minStartDate(): string {
    return moment()
      .subtract(1, 'year')
      .format('YYYY-MM-DD');
  }

  minEndDate(): string {
    return moment(this.searchForm.get('data_inicio').value).format('YYYY-MM-DD');
  }

  maxEndDate(): string {
    const momentAdd = moment(this.searchForm.get('data_inicio').value).add(30, 'day');
    return momentAdd.isAfter(moment())
      ? moment().format('YYYY-MM-DD')
      : momentAdd.format('YYYY-MM-DD');
  }

  atualDate(): string {
    return moment().format('YYYY-MM-DD');
  }

  get titulo(): FormControl {
    return this.searchForm.get('titulo') as FormControl;
  }

  get descricao(): FormControl {
    return this.searchForm.get('descricao') as FormControl;
  }

  get tipo(): FormControl {
    return this.searchForm.get('tipo') as FormControl;
  }

  get data_inicio(): FormControl {
    return this.searchForm.get('data_inicio') as FormControl;
  }

  get data_fim(): FormControl {
    return this.searchForm.get('data_fim') as FormControl;
  }

  get situacao(): FormControl {
    return this.searchForm.get('situacao') as FormControl;
  }

  onSubmit() {
    this.navCtrl.navigateRoot(['home', this.searchForm.value]);
  }
}
