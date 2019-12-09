import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss']
})
export class MapPage {
  @ViewChild('pacInput', { read: ElementRef, static: true }) pacInputElement: ElementRef;

  params: any;
  constructor(private router: Router) {}

  formPesquisar() {
    this.router.navigate(['pesquisar']);
  }
}
