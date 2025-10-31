import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
  standalone: false,
})
export class UserListPage implements OnInit {
  users: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      this.users = await this.firebaseService.getAllUsers();

      console.log('Loaded users for admin:', this.users.length);
    } catch (error: any) {
      console.error('Error loading users:', error);
      this.errorMessage = 'Failed to load users. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async toggleBan(user: any, event: any) {
  const isBanned = event.detail.checked;
  user.isBanned = isBanned;

  try {
    await this.firebaseService.updateUserData(user.id, { isBanned });
    console.log(`${user.name} ban status updated: ${isBanned}`);
  } catch (error) {
    console.error('Failed to update ban status:', error);
    // Revert toggle in case of error
    user.isBanned = !isBanned;
  }
}


  async deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        this.firebaseService.deleteUserData(userId);
        alert('User deleted ❌');
        console.log('Deleted user:', userId);
        // Reload the user list
        await this.loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  }
}
