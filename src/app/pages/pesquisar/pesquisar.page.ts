import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-pesquisar',
  templateUrl: './pesquisar.page.html',
  styleUrls: ['./pesquisar.page.scss']
})
export class PesquisarPage implements OnInit {
  searchForm: FormGroup;
  date: string;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm(): void {
    this.searchForm = this.fb.group({
      tipo: [''],
      data_inicio: [''],
      data_fim: [''],
      situacao: ['Achado', [Validators.required]]
    });
  }

  limpar() {
    this.router.navigate(['home/map']);
  }

  minStartDate(): string {
    return moment()
      .subtract(3, 'month')
      .format('YYYY-MM-DD');
  }

  minEndDate(): string {
    const dataInicio = this.searchForm.get('data_inicio').value;
    if (dataInicio) {
      return moment(this.searchForm.get('data_inicio').value).format('YYYY-MM-DD');
    } else {
      return moment()
        .subtract(3, 'month')
        .format('YYYY-MM-DD');
    }
  }

  atualDate(): string {
    return moment().format('YYYY-MM-DD');
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
    const dataInicio = this.searchForm.get('data_inicio');
    if (dataInicio.value) {
      this.searchForm.get('data_inicio').setValue(moment(dataInicio.value).format('YYYY-MM-DD'));
    }
    const navigationExtras: NavigationExtras = {
      state: {
        params: this.searchForm.value
      }
    };
    this.router.navigate(['home/map'], navigationExtras);
  }
}
