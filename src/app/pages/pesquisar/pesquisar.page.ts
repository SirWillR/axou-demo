import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

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
      descricao: ['', [Validators.required, Validators.minLength(6)]],
      tipo: ['', [Validators.required]],
      data_inicio: ['', [Validators.required]],
      data_fim: ['', [Validators.required]],
      situacao: ['', [Validators.required]]
    });
  }

  get descricao(): FormControl {
    return this.searchForm.get('descricao') as FormControl;
  }

  get tipo(): FormControl {
    return this.searchForm.get('tipo') as FormControl;
  }

  get data_inicio(): FormControl {
    return this.searchForm.get('data') as FormControl;
  }

  get data_fim(): FormControl {
    return this.searchForm.get('data') as FormControl;
  }

  get situacao(): FormControl {
    return this.searchForm.get('situacao') as FormControl;
  }

  onSubmit() {
    this.navCtrl.navigateRoot(['home', this.searchForm.value]);
  }
}
