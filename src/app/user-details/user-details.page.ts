import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera'

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
  standalone: false,
})
export class UserDetailsPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  user = {
    name: '',
    username: '',
    dob:'',
    age:'',
    bio: '',
    images: [] as string[],
    movies: [] as string[],
  };

  newMovie = '';

  // Pick an image from gallery
  async pickImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    });
    if (image) this.user.images.push(image.dataUrl!);
  }

  // Take a new photo
  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    });
    if (image) this.user.images.push(image.dataUrl!);
  }

  // Add favorite movie
  addMovie() {
    if (this.newMovie.trim()) {
      this.user.movies.push(this.newMovie.trim());
      this.newMovie = '';
    }
  }

  // Remove movie
  removeMovie(index: number) {
    this.user.movies.splice(index, 1);
  }

  // Save profile (hook to your backend)
  saveProfile() {
    console.log('Profile saved:', this.user);
    // TODO: send this.user to your API or Firebase
  }
}
