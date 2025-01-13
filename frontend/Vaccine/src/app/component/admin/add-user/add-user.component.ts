import { Component } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  standalone: false,
  
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  newUser: any = {};
  errorMessage: string | null = null;
  username: string = '';
  password: string = '';
  role: string = '';

  constructor(private userService: UserService, private router: Router) {}

  // Method to register a new user
  onSubmit(addAccountForm: NgForm): void {
    if (!addAccountForm.valid) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin tài khoản!';
      return;
    }

    this.userService.register(this.newUser).subscribe({
      next: (data) => {
        alert('Tạo tài khoản thành công!');
        addAccountForm.reset
      },
      error: (err) => {
        this.errorMessage = err.error || 'Có lỗi xảy ra. Vui lòng thử lại.';
      },
    });
  }
}
