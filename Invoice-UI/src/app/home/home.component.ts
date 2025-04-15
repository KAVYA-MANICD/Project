import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule} from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  imports: [RouterModule,NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {}
  logout(){
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginUser');
    this.router.navigate(['/login']);
  }
}
