import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AuthProvider } from 'src/app/shared/auth.types';
import { OverlayService } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;
  authProviders = AuthProvider;
  configs = {
    isSignIn: true,
    action: 'Entrar',
    actionChange: 'Criar Conta'
  };
  private nameControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  constructor(
    private authService: AuthService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private overlayService: OverlayService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.onLoginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

  chageAuthAction() {
    this.configs.isSignIn = !this.configs.isSignIn;
    const { isSignIn } = this.configs;
    this.configs.action = isSignIn ? 'Entrar' : 'Criar Conta';
    this.configs.actionChange = isSignIn ? 'Criar Conta' : 'Já possuo uma conta';
    !isSignIn
      ? this.onLoginForm.addControl('name', this.nameControl)
      : this.onLoginForm.removeControl('name');
  }

  async forgotPass() {}

  goToRegister() {
    this.navCtrl.navigateRoot('/register');
  }

  async goToHome(provider: AuthProvider) {
    const loading = await this.overlayService.loading();
    try {
      const credentials = await this.authService.authenticate({
        isSignIn: this.configs.isSignIn,
        user: this.onLoginForm.value,
        provider
      });
      this.modalCtrl.dismiss();
      this.navCtrl.navigateRoot(this.navParams.get('redirect') || '');
    } catch (e) {
      this.overlayService.toast({
        message: e.message
      });
    } finally {
      loading.dismiss();
    }
  }
}
