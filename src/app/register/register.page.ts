import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  name = '';
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  async onRegister() {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const user = await this.firebaseService.registerUser(
        this.email,
        this.password
      );
      console.log('[v0] Registration successful for user:', user.uid);

      // Save user profile to Realtime Database
      await this.firebaseService.saveUserProfile(user.uid, {
        name: this.name,
        email: this.email,
        photo: 'assets/logo.png',
        age: 0,
        bio: '',
      });

      console.log('[v0] User profile saved to database');
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('[v0] Registration failed:', error);
      this.errorMessage =
        error.message || 'Registration failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  ngOnInit() {}
}
