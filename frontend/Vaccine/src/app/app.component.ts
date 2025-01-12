import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  isLoginPage: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Check if the route is 'login'
      this.isLoginPage = event.urlAfterRedirects === '/login';
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
  }
}
