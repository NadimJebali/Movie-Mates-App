import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false,
})
export class RegisterPage implements OnInit {

  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onRegister() {
    alert(`Registered!\nName: ${this.name}\nEmail: ${this.email}`);
    // After registering, navigate to login or home
    // this.router.navigate(['/login']);
  }

  ngOnInit() {
  }

}
