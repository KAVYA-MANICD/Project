import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const fromUnifiedDashboard = params['fromUnifiedDashboard'];
      if (fromUnifiedDashboard === 'yes') {
        localStorage.setItem('fromUnifiedDashboard', 'true');
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    if (window.innerWidth <= 1024) {
      this.isMenuOpen = false;
    }
  }

  onLogout(): void {
    const fromUnified = localStorage.getItem('fromUnifiedDashboard');

    if (fromUnified === 'true') {
      localStorage.removeItem('fromUnifiedDashboard');
      window.location.href = 'http://localhost:3000/';
    } else {
      this.router.navigate(['/login']);
    }
    this.closeMenu();
  }
}
