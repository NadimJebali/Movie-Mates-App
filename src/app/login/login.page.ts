import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private alertController: AlertController
  ) {}

  async onLogin() {
    if (!this.email || !this.password) {
      this.showAlert('Error', 'Please enter email and password.');
      return;
    }

    try {
      const user = await this.firebaseService.loginUser(
        this.email,
        this.password
      );
      console.log('Logged in user:', user.uid);
      this.router.navigate(['/tabs']);
    } catch (error: any) {
      console.error('Login failed:', error);
      this.showAlert(
        'Login Failed',
        error.message || 'Invalid email or password.'
      );
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  ngOnInit() {}
}
