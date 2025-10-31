import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.page.html',
  styleUrls: ['./movie-list.page.scss'],
  standalone: false,
})
export class MovieListPage implements OnInit {
  movies: any[] = [];
  newMovie: string = '';
  isLoading = false;
  errorMessage = '';

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    await this.loadMovies();
  }

  async loadMovies() {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      this.movies = await this.firebaseService.getAllMovies();
    } catch (error) {
      console.error('Error loading movies:', error);
      this.errorMessage = 'Failed to load movies.';
    } finally {
      this.isLoading = false;
    }
  }

  async addMovie() {
    if (!this.newMovie.trim()) return;
    try {
      await this.firebaseService.saveMovie(this.newMovie.trim());
      this.newMovie = '';
      await this.loadMovies();
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  }

  async deleteMovie(movieId: string) {
    if (confirm('Are you sure you want to delete this movie?')) {
      try {
        await this.firebaseService.deleteMovie(movieId);
        await this.loadMovies();
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  }
}
