import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { UserRole } from '../enums/user-role.enum';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
  standalone: false,
})
export class UserDetailsPage implements OnInit {

  user = {
    name: '',
    username: '',
    email: '',
    age: '',
    bio: '',
    sex: '',
    isBanned: false,
    images: [] as string[],
    movies: [] as string[],
    role: UserRole.USER,
  };

  availableMovies: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  async ngOnInit() {
    await this.loadMovies();
  }

  async loadMovies() {
    try {
      this.isLoading = true;
      this.availableMovies = await this.firebaseService.getAllMovies();
    } catch (error) {
      console.error('Error loading movies:', error);
      this.errorMessage = 'Failed to load movies.';
    } finally {
      this.isLoading = false;
    }
  }

  toggleMovie(movieName: string) {
    const index = this.user.movies.indexOf(movieName);
    if (index > -1) {
      this.user.movies.splice(index, 1);
    } else {
      this.user.movies.push(movieName);
    }
  }

  isSelected(movieName: string): boolean {
    return this.user.movies.includes(movieName);
  }

  async pickImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    });
    if (image) this.user.images.push(image.dataUrl!);
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    });
    if (image) this.user.images.push(image.dataUrl!);
  }

  async saveProfile() {
    try {
      const currentUser = this.firebaseService.getCurrentUser();
      if (!currentUser) {
        console.error('[v0] No logged-in user found');
        return;
      }

      const userData = {
        ...this.user,
        email: currentUser.email,
        role: 'USER',
      };

      await this.firebaseService.saveUserProfile(currentUser.uid, userData);
      console.log('[v0] User profile saved successfully:', currentUser.uid);
      this.router.navigate(['/tabs']);
    } catch (error) {
      console.error('[v0] Error saving user profile:', error);
    }
  }
}
