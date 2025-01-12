import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isManager: boolean = false;  
  isAdmin: boolean = false;   

  constructor(private authService: AuthService, private router: Router) {}
  
  ngOnInit(): void {
    const role = this.authService.getRole();
    if (role === 'ADMIN') {
      this.isAdmin = true;
    } else if (role === 'MANAGER') {
      this.isManager = true;
    }
  }

  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/login']); 
  }
}
