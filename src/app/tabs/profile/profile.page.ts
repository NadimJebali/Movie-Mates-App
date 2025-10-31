import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  user: any = {};

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  ngOnInit() {
    this.loadUser();
  }

  async loadUser() {
    const currentUser = this.firebaseService.getCurrentUser();
    if (currentUser) {
      this.user = await this.firebaseService.getUserProfile(currentUser.uid);
    }
  }

  async logout() {
    await this.firebaseService.logoutUser();
    this.router.navigate(['/login']);
  }
}
