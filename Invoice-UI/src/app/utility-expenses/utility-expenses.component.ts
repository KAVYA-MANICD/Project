import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PayrollService } from '../payroll.service';
import { Expense, PayrollData } from '../models/payroll.model';
import jsPDF from 'jspdf';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-utility-expenses',
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './utility-expenses.component.html',
  styleUrl: './utility-expenses.component.css'
})
export class UtilityExpensesComponent implements OnInit{


  
  ngOnInit() {
    this.initializeForm();
    this.loadExpenses();  
  }




  expenseForm!: FormGroup;
  expenseTypes = ['Salary', 'Rent', 'Maintenance'];
  loading = false;
  errorMessage = '';
  successMessage = '';
  isModalOpen = false;
  expenses: Expense[] = [];  

 

  constructor(
    private fb: FormBuilder,
    private payrollService: PayrollService,
    private router: Router
  ) {}

  
 
  

  initializeForm() {
    this.expenseForm = this.fb.group({
      expenseType: ['', Validators.required],
      expenseDescription: ['', Validators.required],
      expenseAmount: ['', [Validators.required, Validators.min(0)]],
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.expenseForm.reset(); // Reset form on modal close
  }


  onSubmit() {
    if (this.expenseForm.valid) {
        this.loading = true;
        const expenseData = this.expenseForm.value;

        this.payrollService.createExpense(expenseData).subscribe({
            next: (response) => {
                console.log('Created expense:', response); // Debug log
                this.successMessage = 'Expense created successfully!';
                this.loading = false;
                this.loadExpenses();
                this.closeModal();
            },
            error: (err) => {
                console.error('Error creating expense:', err); // Debug log
                this.errorMessage = 'Failed to create expense';
                this.loading = false;
            }
        });
    }
}

  

  loadExpenses() {
    this.payrollService.getExpenses().subscribe({
      next: (response) => {
        console.log('Loaded expenses:', response); // Debug log to see the data structure
        this.expenses = response;
      },
      error: (err) => {
        console.error('Error loading expenses:', err);
        this.errorMessage = 'Failed to load expenses';
      }
    });
  }
  deleteExpense(id: number | undefined) {
    console.log('Delete attempted for ID:', id); // Debug log
    
    if (id === undefined || id === null) {
      this.errorMessage = 'Cannot delete: Invalid expense ID';
      return;
    }

    if (confirm('Are you sure you want to delete this expense?')) {
      this.payrollService.deleteExpense(id).subscribe({
        next: () => {
          this.successMessage = 'Expense deleted successfully';
          this.loadExpenses();
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.errorMessage = 'Failed to delete expense';
        }
      });
    }
  }


  isFieldInvalid(fieldName: string): boolean {
    const field = this.expenseForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }




  
  companyDetails = {
    name: 'Jupiter King Technologies',
    address: ' Nrupathunga Road, Kuvempunagar',
    city: 'Mysore',
    state: 'Karnataka',
    pincode: '570023',
    phone: '91+ 7259489277',
    email: 'jupiterkingtechnologies@gmail.com'
  };

 

  



  generateInvoice(expense: Expense) {
    
    const invoiceContent = this.createInvoiceContent(expense);
    
    
    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
  
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${expense.invoiceNumber}.html`; 
    a.click(); 
  
    
    window.URL.revokeObjectURL(url);

    const printWindow = window.open(url, '_blank');
    printWindow?.document.write(invoiceContent);
    printWindow?.document.close();
    printWindow?.print();
  }
  
 

  

 

 

 
  
  
  
  createInvoiceContent(expense: Expense): string {
      const date = new Date().toLocaleDateString();
    
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-details { margin-bottom: 30px; }
            .invoice-details { margin-bottom: 30px; }
            .expense-details { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px; border: 1px solid #ddd; }
            .total { margin-top: 20px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
          </div>
          
          <div class="company-details">
            <h2>${this.companyDetails.name}</h2>
            <p>${this.companyDetails.address}</p>
            <p>${this.companyDetails.city}, ${this.companyDetails.state} </p>
            <p>Pincode: ${this.companyDetails.pincode}</p>
            <p>Phone: ${this.companyDetails.phone}</p>
            <p>Email: ${this.companyDetails.email}</p>
          </div>
    
          <div class="invoice-details">
            <p><strong>Invoice Number:</strong> ${expense.invoiceNumber}</p>
            <p><strong>Date:</strong> ${date}</p>
          </div>
    
          <div class="expense-details">
            <table>
              <thead>
                <tr>
                  <th>Expense Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${expense.expenseType}</td>
                  <td>${expense.expenseDescription}</td>
                  <td>$${expense.expenseAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
    
            <div class="total">
              <h3>Total Amount: $${expense.expenseAmount.toFixed(2)}</h3>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    

  



downloadCSV(expense: Expense) {
  const csvContent = this.createCSVContent(expense);
  
  this.payrollService.downloadCSV(csvContent, expense.invoiceNumber)
    .subscribe({
      next: (response: any) => {
        // Create blob from the response
        const blob = new Blob([response.body], { type: 'text/csv' });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Get filename from Content-Disposition header if available
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `expense_${expense.invoiceNumber}.csv`;
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        this.successMessage = 'CSV file has been saved and downloaded successfully';
      },
      error: (error) => {
        console.error('Error with CSV file:', error);
        this.errorMessage = 'Failed to process CSV file';
      }
    });
}




private handleDownloadResponse(response: HttpResponse<Blob>, expense: Expense) {
  // Check if the response is successful
  if (response.status === 200) {
    const blob = new Blob([response.body!], { type: 'text/csv' });
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = `expense_${expense.invoiceNumber}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Show success message
    this.successMessage = `CSV file has been saved and downloaded successfully.`;
  } else {
    // Handle error response
    this.errorMessage = `Failed to download CSV: ${response.statusText}`;
  }
}

private createCSVContent(expense: Expense): string {
  const headers = ['Expense Type', 'Description', 'Amount', 'Invoice Number', 'Date'];
  const data = [
    this.escapeCSV(expense.expenseType),
    this.escapeCSV(expense.expenseDescription),
    expense.expenseAmount.toString(),
    expense.invoiceNumber,
    new Date().toLocaleDateString()
  ];

  return `${headers.join(',')}\n${data.join(',')}`;
}

private escapeCSV(str: string): string {
  if (!str) return '';
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;  // Escape CSV special characters
  }
  return str;
}
}