import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false,
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private router: Router,
      private firebaseService: FirebaseService) {}

  onLogin() {
    console.log('Logging in with:', this.email, this.password);
    this.firebaseService.loginUser(this.email,this.password);
    this.router.navigate(['/home']);
  }

  ngOnInit() {
  }

}
