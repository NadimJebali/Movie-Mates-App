import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
  standalone: false,
})
export class UserDetailsPage implements OnInit {
  constructor(private router: Router,
    private firebaseService: FirebaseService) {}

  ngOnInit() {}

  user = {
    name: '',
    username: '',
    age: '',
    bio: '',
    images: [] as string[],
    movies: [] as string[],
  };

  // ✅ Predefined movie list
  availableMovies = [
    'Inception',
    'Interstellar',
    'The Matrix',
    'Titanic',
    'Avatar',
    'The Dark Knight',
    'La La Land',
    'Forrest Gump',
    'The Shawshank Redemption',
    'The Godfather',
  ];

  // ✅ Toggle movie selection
  toggleMovie(movie: string) {
    const index = this.user.movies.indexOf(movie);
    if (index > -1) {
      this.user.movies.splice(index, 1);
    } else {
      this.user.movies.push(movie);
    }
  }

  isSelected(movie: string): boolean {
    return this.user.movies.includes(movie);
  }

  // ✅ Camera methods
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

  // ✅ Save profile to Firebase
  async saveProfile() {
    try {
      const currentUser = this.firebaseService.getCurrentUser();
      if (!currentUser) {
        console.error('[v0] No logged-in user found');
        return;
      }

      const userData = {
        name: this.user.name,
        username: this.user.username,
        age: this.user.age,
        bio: this.user.bio,
        movies: this.user.movies,
        images: this.user.images,
      };

      await this.firebaseService.saveUserProfile(currentUser.uid, userData);

      console.log('[v0] User profile saved successfully:', currentUser.uid);
      this.router.navigate(['/home'])
    } catch (error) {
      console.error('[v0] Error saving user profile:', error);
    }
  }
}
