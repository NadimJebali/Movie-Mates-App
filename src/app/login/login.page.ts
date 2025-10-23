import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { AlertController, ToastController } from '@ionic/angular';

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
    private alertController: AlertController,
    private toastCtrl: ToastController
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
      const userData = await this.firebaseService.getUserProfile(user.uid);
      if (userData.isBanned) {
        const toast = await this.toastCtrl.create({
          header: `Account Status`,
          message: 'You have been banned',
          duration: 3000,
          position: 'top',
          color: 'light',
          cssClass: 'compatibility-toast',
          buttons: [
            {
              text: '✖',
              role: 'cancel',
              handler: () => {
                console.log('Toast dismissed');
              },
            },
          ],
        });
        await toast.present();
      } else if (userData.role == 'ADMIN') {
        console.log('Logged in admin:', user.uid);
        this.router.navigate(['/admin']);
      } else {
        console.log('Logged in user:', user.uid);
        this.router.navigate(['/tabs']);
      }
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
