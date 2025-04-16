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

    // Case 1: Redirect if query param is present
    if (fromUnifiedDashboard === 'yes') {
      localStorage.setItem('fromUnifiedDashboard', 'true');
      window.location.href = 'http://localhost:3000/';
      return;
    }
  }
}
