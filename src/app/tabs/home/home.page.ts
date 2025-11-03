import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { GeminiService } from 'src/app/services/gemini.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  users: any[] = [];
  isLoading = true;
  errorMessage = '';
  result?: { score: number; summary: string };


  constructor(private firebaseService: FirebaseService, private geminiService: GeminiService, private toastCtrl: ToastController) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      this.users = await this.firebaseService.getAllUsers();

      if (this.users.length === 0) {
        console.log('No users found in database, adding fallback data');
      }

      // Add transform and transition properties for animation
      this.users = this.users.map(user => ({
        ...user,
        transform: '',
        transition: ''
      }));

      console.log('Loaded users:', this.users.length);
    } catch (error: any) {
      console.error('Error loading users:', error);
      this.errorMessage = 'Failed to load users. Please try again.';

    } finally {
      this.isLoading = false;
    }
  }

  onPan(event: any, index: number) {
    if (!this.users[index]) return;

    const x = event.deltaX;
    const y = event.deltaY;
    const rotate = x / 10;
    this.users[index].transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    this.users[index].transition = 'none';
  }


  async swipeRight(index: number) {
    if (!this.users[index]) return;

    const user = this.users[index];
    console.log('Swiped right on:', user.name);

    // Animate card out
    this.users[index].transform = 'translate(1000px, 0px) rotate(30deg)';
    this.users[index].transition = 'transform 0.5s ease';

    // Remove from array after animation
    setTimeout(() => {
      this.users.splice(index, 1);
    }, 500);

    // TODO: Save swipe interaction to Firebase
    // await this.firebaseService.saveSwipeInteraction(
    //   this.firebaseService.getCurrentUser()?.uid,
    //   user.id,
    //   'like'
    // );
  }

  async swipeLeft(index: number) {
    if (!this.users[index]) return;

    const user = this.users[index];
    console.log('Swiped left on:', user.name);

    // Animate card out
    this.users[index].transform = 'translate(-1000px, 0px) rotate(-30deg)';
    this.users[index].transition = 'transform 0.5s ease';

    // Remove from array after animation
    setTimeout(() => {
      this.users.splice(index, 1);
    }, 500);

    // TODO: Save swipe interaction to Firebase
    // await this.firebaseService.saveSwipeInteraction(
    //   this.firebaseService.getCurrentUser()?.uid,
    //   user.id,
    //   'pass'
    // );
  }

 async checkCompatibility(targetUserId: string) {
  const currentUser = this.firebaseService.getCurrentUser();
  if (!currentUser) {
    console.error('User not logged in');
    return;
  }

  const userA = await this.firebaseService.getUserProfile(currentUser.uid);
  const userB = await this.firebaseService.getUserProfile(targetUserId);

  if (!userA || !userB) {
    console.error('Could not find both user profiles');
    return;
  }

  this.result = await this.geminiService.getCompatibilityScore(userA, userB);
  console.log('Compatibility:', this.result);

  const toast = await this.toastCtrl.create({
  header: `💞 Compatibility: ${this.result.score}%`,
  message: this.result.summary,
  duration: 50000,
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

}
}
