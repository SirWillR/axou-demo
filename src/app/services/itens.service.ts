import { Injectable } from '@angular/core';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { ItemClass } from '../shared/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItensService extends Firestore<ItemClass> {
  constructor(db: AngularFirestore) {
    super(db);
    this.init();
  }

  private init(): void {
    this.setCollection(`/itens`);
    return;
  }

  setitens({
    tipo,
    dataInicio,
    dataFim,
    situacao
  }: {
    tipo?: string;
    dataInicio?: string;
    dataFim?: string;
    situacao?: string;
  }): void {
    this.setCollection(`/itens`, ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (tipo && 'null' !== tipo) {
        query = query.where('tipo', '==', tipo);
      }
      if (dataInicio && 'null' !== dataInicio) {
        query = query.where('data', '>=', new Date(dataInicio));
      }
      if (dataFim && 'null' !== dataFim) {
        query = query.where('data', '<=', new Date(dataFim));
      }
      if (situacao && 'null' !== situacao) {
        query = query.where('situacao', '==', situacao);
      }
      return query;
    });
    return;
  }
}
