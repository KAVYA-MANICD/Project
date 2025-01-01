import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-jupiter',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './jupiter.component.html',
  styleUrl: './jupiter.component.css'
})
export class JupiterComponent {
  expenseForm: FormGroup;
  expenseTypes = [
    { value: 'SALARY', label: 'Salary' },
    { value: 'RENT', label: 'Rent' },
    { value: 'MAINTENANCE', label: 'Maintenance' }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.expenseForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
      expenseType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const expenseData = this.expenseForm.value;
      
      this.http.post('http://localhost:8080/api/expenses', expenseData)
        .subscribe({
          next: (response) => {
            alert('Expense invoice created successfully!');
            this.expenseForm.reset();
          },
          error: (error) => {
            alert('Error creating expense invoice: ' + error.message);
          }
        });
    }
  }

}
