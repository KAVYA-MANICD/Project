import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-expenses-type-management',
  standalone: true,
  imports: [NavbarComponent, FormsModule, NgIf, NgFor],
  templateUrl: './expenses-type-management.component.html',
  styleUrls: ['./expenses-type-management.component.css']
})
export class ExpensesTypeManagementComponent implements OnInit {
  newExpenseType: string = '';
  expenseType: { expenseId: number; expenseType: string }[] = [];

  private apiUrl = 'http://localhost:8080/expense-types';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getExpenseTypes();
  }

  getExpenseTypes(): void {
    this.http.get<{ expenseId: number; expenseType: string }[]>(`${this.apiUrl}/all`)
      .subscribe({
        next: data => this.expenseType = data,
        error: err => {
          console.error('Error loading expense types:', err);
          this.toastr.error('Failed to load expense types.', 'Error');
        }
      });
  }

  openModal(): void {
    const modalElement = document.getElementById('expenseModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'flex';
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('expenseModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
    }
  }

  saveExpenseType(): void {
    const trimmed = this.newExpenseType.trim();
    if (!trimmed) {
      this.toastr.warning('Please enter an expense type.', 'Warning');
      return;
    }
  
    this.http.post<{ expenseId: number; expenseType: string }>(`${this.apiUrl}/Create`, {
      expenseType: trimmed
    }).subscribe({
      next: (newExpense) => {
        this.expenseType.push(newExpense); // Update with new expense
        this.newExpenseType = ''; // Reset the form input
        this.closeModal();
        this.toastr.success('Expense type added successfully!', 'Success');
      },
      error: (err) => {
        console.error('Error saving expense type:', err);
        this.toastr.error('Could not save expense type.', 'Error');
      }
    });
  }
  
  deleteExpenseType(expenseId: number): void {
    if (confirm('Are you sure you want to delete this expense type?')) {
      this.http.delete(`${this.apiUrl}/${expenseId}`).subscribe({
        next: () => {
          this.expenseType = this.expenseType.filter(e => e.expenseId !== expenseId);
          this.toastr.success('Expense type deleted successfully!', 'Deleted');
        },
        error: (err) => {
          console.error('Error deleting expense type:', err);
          this.toastr.error('Could not delete expense type.', 'Error');
        }
      });
    }
  }
}
