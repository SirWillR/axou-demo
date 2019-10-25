import { Injectable } from '@angular/core';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { AngularFirestore } from '@angular/fire/firestore';
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
    titulo,
    descricao,
    tipo,
    data_inicio,
    data_fim,
    situacao
  }: {
    titulo: string;
    descricao: string;
    tipo: string;
    data_inicio: string;
    data_fim: string;
    situacao: string;
  }): void {
    this.setCollection(`/itens`, ref =>
      ref
        .where('titulo', 'array-contains', titulo)
        .where('descricao', 'array-contains', descricao)
        .where('tipo', '==', tipo)
        .startAfter('data', data_inicio)
        .endBefore('data', data_fim)
        .where('situacao', '==', situacao)
    );
    return;
  }
}
