import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule,RouterLink],
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
