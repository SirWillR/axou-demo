import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  lista: string;
  map: string;
  params: string;
  constructor(private activatedRoute: ActivatedRoute) {}

  ionViewDidEnter() {
    const url = this.activatedRoute.snapshot['_routerState'].url;
    this.params = url.substring(url.split('/')[2].split(';')[0] === 'map' ? 9 : 11, url.length);
    this.lista = 'lista' + this.params;
    this.map = 'map' + this.params;
  }
}
