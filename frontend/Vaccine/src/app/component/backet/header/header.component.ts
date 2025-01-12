import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isManager: boolean = false;  // Set this based on your logic
  isAdmin: boolean = false;    // Set this based on your logic

  constructor() {
    // For demonstration, toggle the roles (In real app, use authentication service)
    this.isManager = true;  // Or get the role from a service
    this.isAdmin = false;   // Adjust these values as per user role
  }
}
