import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const fromUnifiedDashboard = params.get('fromUnifiedDashboard');

    if (fromUnifiedDashboard === 'yes') {
      localStorage.setItem('fromUnifiedDashboard', 'true');
      window.location.href = 'http://localhost:3000/';
      return;
    }
  }

  onLogout(): void {
    const fromUnified = localStorage.getItem('fromUnifiedDashboard');

    if (fromUnified === 'true') {
      // Optional: clear the flag if you don't want it to persist forever
      localStorage.removeItem('fromUnifiedDashboard');
      window.location.href = 'http://localhost:3000/';
    } else {
      // fallback - allow Angular to route to the login page
      window.location.href = '/login';
    }
  }
}
