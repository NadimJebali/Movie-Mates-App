import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
} from 'firebase/database';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app: any;
  private database: any;
  private auth: any;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      this.app = initializeApp(environment.firebase);
      this.database = getDatabase(this.app);
      this.auth = getAuth(this.app);

      // Monitor auth state changes
      onAuthStateChanged(this.auth, (user) => {
        this.currentUserSubject.next(user);
      });

      console.log('[v0] Firebase initialized successfully');
    } catch (error) {
      console.error('[v0] Firebase initialization error:', error);
    }
  }

  // Authentication Methods
  async registerUser(email: string, password: string): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log('[v0] User registered:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('[v0] Registration error:', error);
      throw error;
    }
  }

  async loginUser(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log('[v0] User logged in:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('[v0] Login error:', error);
      throw error;
    }
  }

  async logoutUser(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  // Realtime Database Methods
  async saveUserProfile(userId: string, userData: any): Promise<void> {
    try {
      const userRef = ref(this.database, `users/${userId}`);
      await set(userRef, {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log('[v0] User profile saved:', userId);
    } catch (error) {
      console.error('[v0] Error saving user profile:', error);
      throw error;
    }
  }

  async saveMovie(movieName: string): Promise<void> {
    try {
      const moviesRef = ref(this.database, 'movies');
      const newMovieRef = push(moviesRef);
      await set(newMovieRef, {
        name: movieName,
      });

      console.log('[v0] Movie added:', movieName);
    } catch (error) {
      console.error('[v0] Error saving movie:', error);
      throw error;
    }
  }

  async getAllMovies(): Promise<any[]> {
    try {
      const moviesRef = ref(this.database, 'movies');
      const snapshot = await get(moviesRef);

      if (snapshot.exists()) {
        const movies: any[] = [];
        snapshot.forEach((childSnapshot) => {
          movies.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });

        console.log('[v0] Movies retrieved:', movies.length);
        return movies;
      } else {
        console.log('[v0] No movies found');
        return [];
      }
    } catch (error) {
      console.error('[v0] Error retrieving movies:', error);
      throw error;
    }
  }

   async deleteMovie(movieId: string): Promise<void> {
    try {
      const movieRef = ref(this.database, `movies/${movieId}`);
      await remove(movieRef);
      console.log('[v0] Movie deleted:', movieId);
    } catch (error) {
      console.error('[v0] Error deleting movie:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<any> {
    try {
      const userRef = ref(this.database, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        console.log('[v0] User profile retrieved:', userId);
        return snapshot.val();
      } else {
        console.log('[v0] No user profile found:', userId);
        return null;
      }
    } catch (error) {
      console.error('[v0] Error retrieving user profile:', error);
      throw error;
    }
  }

  // Save swipe interaction
  async saveSwipeInteraction(
    userId: string,
    targetUserId: string,
    action: 'like' | 'pass'
  ): Promise<void> {
    try {
      const swipeRef = ref(this.database, `swipes/${userId}`);
      const newSwipeRef = push(swipeRef);
      await set(newSwipeRef, {
        targetUserId,
        action,
        timestamp: new Date().toISOString(),
      });
      console.log('[v0] Swipe interaction saved:', action);
    } catch (error) {
      console.error('[v0] Error saving swipe interaction:', error);
      throw error;
    }
  }

  // Get all users
  async getAllUsers(): Promise<any[]> {
    try {
      const usersRef = ref(this.database, 'users');
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const users: any[] = [];
        snapshot.forEach((childSnapshot) => {
          users.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        console.log('[v0] All users retrieved:', users.length);
        return users;
      } else {
        console.log('[v0] No users found');
        return [];
      }
    } catch (error) {
      console.error('[v0] Error retrieving users:', error);
      throw error;
    }
  }

  // Real-time listener for users
  listenToUsers(callback: (users: any[]) => void): () => void {
    try {
      const usersRef = ref(this.database, 'users');
      const unsubscribe = onValue(usersRef, (snapshot) => {
        const users: any[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            users.push({
              id: childSnapshot.key,
              ...childSnapshot.val(),
            });
          });
        }
        console.log('[v0] Users updated:', users.length);
        callback(users);
      });
      return unsubscribe;
    } catch (error) {
      console.error('[v0] Error setting up users listener:', error);
      throw error;
    }
  }

  // Save match
  async saveMatch(userId1: string, userId2: string): Promise<void> {
    try {
      const matchRef = ref(this.database, `matches/${userId1}_${userId2}`);
      await set(matchRef, {
        user1: userId1,
        user2: userId2,
        matchedAt: new Date().toISOString(),
      });
      console.log('[v0] Match saved');
    } catch (error) {
      console.error('[v0] Error saving match:', error);
      throw error;
    }
  }

  // Get user's matches
  async getUserMatches(userId: string): Promise<any[]> {
    try {
      const matchesRef = ref(this.database, 'matches');
      const snapshot = await get(matchesRef);
      const userMatches: any[] = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const match = childSnapshot.val();
          if (match.user1 === userId || match.user2 === userId) {
            userMatches.push({
              id: childSnapshot.key,
              ...match,
            });
          }
        });
      }
      console.log('[v0] User matches retrieved:', userMatches.length);
      return userMatches;
    } catch (error) {
      console.error('[v0] Error retrieving user matches:', error);
      throw error;
    }
  }

  // Update user data
  async updateUserData(userId: string, updates: any): Promise<void> {
    try {
      const userRef = ref(this.database, `users/${userId}`);
      await update(userRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      console.log('[v0] User data updated:', userId);
    } catch (error) {
      console.error('[v0] Error updating user data:', error);
      throw error;
    }
  }

  // Delete user data
  async deleteUserData(userId: string): Promise<void> {
    try {
      const userRef = ref(this.database, `users/${userId}`);
      await remove(userRef);
      console.log('[v0] User data deleted:', userId);
    } catch (error) {
      console.error('[v0] Error deleting user data:', error);
      throw error;
    }
  }
}
