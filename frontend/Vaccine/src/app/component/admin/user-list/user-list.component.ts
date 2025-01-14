import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  username: string = '';
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Không có quyền truy cập!');
        this.router.navigate(['/login']);
      },
    });
  }

  searchUsers(): void {
    if (!this.username.trim()) {
      this.handleError("Vui lòng nhập tên tìm kiếm");
      return;
    }

    this.errorMessage = '';
    this.userService.searchUsers(this.username).subscribe({
      next: (data) => {
        this.users = data;
      },
      error: () => {
        this.handleError("Không tìm thấy tài khoản tương ứng!");
      }
    });
  }

  activateUser(userId: number): void {
    this.errorMessage = '';
    this.userService.activateUser(userId).subscribe(
      (response) => {
        this.showSuccess(response.message); 
        this.updateUserStatus(userId, true); 
      },
      () => {
        this.handleError('Không thể kích hoạt tài khoản.');
      }
    );
  }

  deactivateUser(userId: number): void {
    this.errorMessage = '';
    this.userService.deactivateUser(userId).subscribe(
      (response) => {
        this.showSuccess(response.message); 
        this.updateUserStatus(userId, false);
      },
      () => {
        this.handleError('Không thể vô hiệu hóa tài khoản.');
      }
    );
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    alert(message); 
  }

  private showSuccess(message: string): void {
    alert(message);
  }

  private updateUserStatus(userId: number, isActive: boolean): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.isActive = isActive;
    }
  }
}
