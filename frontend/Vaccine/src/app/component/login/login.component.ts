import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void { }

  onLogin(): void {
    console.log(this.username)
    console.log(this.password)
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        // Lưu token vào localStorage
        this.authService.saveToken(response.token);

        // Chuyển hướng đến trang chủ hoặc trang bạn muốn
        this.router.navigate(['/home-manager']);
        // this.errorMessage = 'Đăng nhập thành công.';
      },
      (error) => {
        this.errorMessage = 'Đăng nhập thất bại. Kiểm tra lại thông tin đăng nhập.';
      }
    );
  }
}
