import { Component } from '@angular/core';

import { Platform, NavController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { OverlayService } from './services/overlay.service';
import { LoginPage } from './pages/login/login.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  pages: { url: string; direction: string; icon: string; text: string }[];
  user: firebase.User;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private authService: AuthService,
    private overlayService: OverlayService,
    private modalCtrl: ModalController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.pages = [
      { url: '/home/map', direction: 'back', icon: 'search', text: 'Pesquisar Item' },
      { url: '/cadastra-item', direction: 'forward', icon: 'attach', text: 'Cadastrar Item' },
      {
        url: '/informacoes',
        direction: 'forward',
        icon: 'information-circle-outline',
        text: 'Informações'
      }
    ];

    this.authService.authState$.subscribe(user => (this.user = user));

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  goToEditPerfil() {
    // this.navCtrl.navigateForward('editar-perfil');
  }

  async login() {
    this.modalCtrl
      .create({
        component: LoginPage
      })
      .then(modal => modal.present());
  }

  async logout(): Promise<void> {
    await this.overlayService.alert({
      message: 'Deseja realmente sair?',
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.authService.logout();
            this.navCtrl.navigateRoot('');
          }
        },
        'Não'
      ]
    });
  }
}
