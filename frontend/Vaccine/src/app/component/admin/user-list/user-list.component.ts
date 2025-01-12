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

  constructor(private userService: UserService, private router: Router) { }
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        alert('Không có quyền truy cập!');
        this.router.navigate(['/login']);
      },
    });
  }
  
  searchUsers(): void {
    if(this.username == '') {
      alert("Vui lòng nhập tên tìm kiếm");
    }

    this.errorMessage = '';
    if (this.username.trim()) {
      this.userService.searchUsers(this.username).subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (err) => {
          this.errorMessage = "Không tìm thấy tài khoản tương ứng!";
        }
      });
    }
  }
  
  activateUser(userId: number): void {
    this.errorMessage = '';
    this.userService.activateUser(userId).subscribe(
      (response) => {
        alert(response.message); 
        this.loadUsers(); 
      },
      (error) => {
        this.errorMessage = error;
        alert('Không thể kích hoạt tài khoản.');
      }
    );
  }
  
  deactivateUser(userId: number): void {
    this.errorMessage = '';
    this.userService.deactivateUser(userId).subscribe(
      (response) => {
        alert(response.message); 
        this.loadUsers(); 
      },
      (error) => {
        this.errorMessage = error;
        alert('Không thể vô hiệu hóa tài khoản.');
      }
    );
  }
  
}
