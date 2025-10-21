import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Database, ref, set } from '@angular/fire/database';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
  standalone: false,
})
export class UserDetailsPage implements OnInit {
  constructor(private db: Database) {}

  ngOnInit() {}

  user = {
    name: '',
    username: '',
    dob: '',
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

  saveProfile() {
    // Create a reference path, e.g., "users/alice"
    const userRef = ref(this.db, 'users/');

    // Write data
    set(userRef, this.user)
      .then(() => {
        console.log('User saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving user:', error);
      });
  }
}
