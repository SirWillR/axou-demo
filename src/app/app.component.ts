import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  pages: { url: string; direction: string; icon: string; text: string }[];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.pages = [
      { url: '/home', direction: 'back', icon: 'home', text: 'Home' },
      { url: '/cadastra-item', direction: 'forward', icon: 'add', text: 'Cadastrar Item' },
      {
        url: '/informacoes',
        direction: 'forward',
        icon: 'information-circle-outline',
        text: 'Informações'
      }
    ];

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
