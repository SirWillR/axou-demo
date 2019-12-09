import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: './pages/home/home.module#HomePageModule' },
  {
    path: 'cadastra-item',
    loadChildren: './pages/cadastra-item/routing/cadastra-item.module#CadastraItemModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'informacoes',
    loadChildren: './pages/informacoes/informacoes.module#InformacoesPageModule'
  },
  { path: 'pesquisar', loadChildren: './pages/pesquisar/pesquisar.module#PesquisarPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
