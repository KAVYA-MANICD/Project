import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';  
import { RouterModule } from '@angular/router';  

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],  
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }  

  ngOnInit(): void {
    // Subscribe to query parameters
    this.route.queryParams.subscribe(params => {
      const fromUnifiedDashboard = params['fromUnifiedDashboard'];
      if (fromUnifiedDashboard === 'yes') {
        localStorage.setItem('fromUnifiedDashboard', 'true');  
      }
    });
  }

  onLogout(): void {
    // Check the flag in localStorage
    const fromUnified = localStorage.getItem('fromUnifiedDashboard');

    if (fromUnified === 'true') {
      localStorage.removeItem('fromUnifiedDashboard');  
      window.location.href = 'http://localhost:3000/';  // Redirect to external URL (e.g., logout page)
    } else {
      this.router.navigate(['/login']);  // Navigate to the login page using Angular Router
    }
  }
}
