import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'cadastra-item',
    loadChildren: './pages/cadastra-item/cadastra-item.module#CadastraItemPageModule'
  },
  {
    path: 'informacoes',
    loadChildren: './pages/informacoes/informacoes.module#InformacoesPageModule'
  },
  { path: 'pesquisar', loadChildren: './pages/pesquisar/pesquisar.module#PesquisarPageModule' },
  { path: 'mostra-item', loadChildren: './pages/mostra-item/mostra-item.module#MostraItemPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
