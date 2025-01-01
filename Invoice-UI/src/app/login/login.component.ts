import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ToastrService } from 'ngx-toastr'; // For toast notifications
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-login',
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
   
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
//   loginForm: FormGroup;
//   errorMessage: string | null = null;

//   constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required]],
//     });
//   }

//   onSubmit(): void {
//     if (this.loginForm.valid) {
//       const loginData = this.loginForm.value;
  
//       this.http.post('http://localhost:8080/api/admin/login', loginData).subscribe(
//         (response: any) => {
//           if (response?.message === 'Login successful') {
//             localStorage.setItem('isAuthenticated', 'true');
//             localStorage.setItem('loginUser', loginData.email);
//             this.router.navigate(['/invoice2']);
//             // this.router.navigate(['/invoice']);
//           }
//         },
//         (error) => {
//           this.errorMessage = error?.error?.message || 'Invalid email or password';
//         }
//       );
//     }
//   }
// }  



loginForm: FormGroup;
errorMessage: string | null = null;

constructor(
  private fb: FormBuilder, 
  private http: HttpClient, 
  private router: Router,
  private toastr: ToastrService
) {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
}

onSubmit(): void {
  if (this.loginForm.valid) {
    const loginData = this.loginForm.value;

    this.http.post('http://localhost:8080/api/admin/login', loginData).subscribe({
      next: (response: any) => {
        if (response?.message === 'Login successful') {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('loginUser', loginData.email);
          
          this.toastr.success('Login successful!', 'Success');
          
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        }
      },
      error: (error) => {
        // Convert null to a default message string
        const errorMsg = error?.error?.message || 'Invalid email or password';
        this.errorMessage = errorMsg;
        this.toastr.error(errorMsg, 'Error');
      }
    });
  } else {
    this.toastr.warning('Please fill all required fields correctly', 'Warning');
  }
}
}