import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
  
      this.http.post('http://localhost:8080/api/admin/login', loginData).subscribe(
        (response: any) => {
          if (response?.message === 'Login successful') {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('loginUser', loginData.email);
            this.router.navigate(['/invoice2']);
            // this.router.navigate(['/invoice']);
          }
        },
        (error) => {
          this.errorMessage = error?.error?.message || 'Invalid email or password';
        }
      );
    }
  }
}  