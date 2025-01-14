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
    this.authService.login(this.username, this.password).subscribe(
      (response) => {

        // Lưu token vào localStorage
        this.authService.saveToken(response.token);
        this.authService.saveRole(response.role);
        
        if(this.authService.getRole() == 'ADMIN') {
          this.router.navigate(['/home-admin']);
        }
        else {
          this.router.navigate(['/home-manager']);
        }
      },
      (error) => {
        this.errorMessage = 'Đăng nhập thất bại. Kiểm tra lại thông tin đăng nhập.';
      }
    );
  }
}
