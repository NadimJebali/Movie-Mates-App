import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false,
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin() {
    console.log('Logging in with:', this.email, this.password);
    // TODO: Replace with Firebase auth
    this.router.navigate(['/home']);
  }

  ngOnInit() {
  }

}
