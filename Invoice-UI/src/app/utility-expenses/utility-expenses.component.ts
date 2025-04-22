import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PayrollService } from '../payroll.service';
import { Expense, PayrollData } from '../models/payroll.model';
import jsPDF from 'jspdf';
import { HttpResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-utility-expenses',
  imports: [ReactiveFormsModule, CommonModule,RouterModule,NavbarComponent],
  templateUrl: './utility-expenses.component.html',
  styleUrl: './utility-expenses.component.css'
})
export class UtilityExpensesComponent implements OnInit{


  
  ngOnInit() {
    this.initializeForm();
    this.loadExpenses();  
    this.loadExpenseTypes();
  }




  expenseForm!: FormGroup;
  expenseTypes: string[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  isModalOpen = false;
  expenses: Expense[] = [];  

 

  constructor(
    private fb: FormBuilder,
    private payrollService: PayrollService,
    private router: Router,
    private http: HttpClient
  ) {}

  
 

  initializeForm() {
    this.expenseForm = this.fb.group({
      expenseType: ['', Validators.required],
      expenseDescription: ['', Validators.required],
      expenseAmount: ['', [Validators.required, Validators.min(0)]],
      billingName: ['', Validators.required],        // 🆕 Added new field
      billingAddress: ['', Validators.required]      // 🆕 Added new field
    });
  }

  loadExpenseTypes() {
    this.http.get<{ expenseId: number; expenseType: string }[]>('http://localhost:8080/expense-types/all').subscribe({
      next: (data) => {
        console.log('Loaded expense types:', data);
        this.expenseTypes = data.map(item => item.expenseType); // Extract expenseType strings
      },
      error: (err) => {
        console.error('Error loading expense types:', err);
        this.errorMessage = 'Failed to load expense types';
      }
    });
  }
  
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.expenseForm.reset();       // 🔁 Reset form on close
    this.successMessage = '';       // 🆕 Clear success
    this.errorMessage = '';         // 🆕 Clear error
  }


  onSubmit() {
    if (this.expenseForm.valid) {
      this.loading = true;
      const expenseData = this.expenseForm.value;   // 🚩 Contains billingName + billingAddress now

      this.payrollService.createExpense(expenseData).subscribe({
        next: (response) => {
          this.successMessage = 'Expense created successfully!';
          this.loading = false;
          this.loadExpenses();
          this.closeModal();
        },
        error: (err) => {
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
    name: 'JupiterKing Technologies Pvt Ltd.',
    address: 'Nrupathunga Road, Kuvempunagar',
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
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US');
  
    const subtotal = expense.expenseAmount;
    const total = expense.expenseAmount;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>INVOICE</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 12px;
          }
          .invoice-container {
            width: 800px;
            margin: 20px auto;
            padding: 30px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: top;
            margin-bottom: 20px;
          }
          .company-info {
            text-align: left;
          }
          .invoice-info {
            text-align: right;
          }
          .invoice-title {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
          }
          .bill-to {
            margin-top: 20px;
          }
          .bill-to strong {
            display: block;
            margin-bottom: 5px;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .details-table th, .details-table td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }
          .details-table th {
            background-color: #f2f2f2;
          }
          .taxed {
            text-align: center;
          }
          .amount {
            text-align: right;
          }
          .summary-table {
            width: 300px;
            margin-top: 20px;
            margin-left: auto;
            border-collapse: collapse;
          }
          .summary-table th, .summary-table td {
            padding: 8px;
            text-align: left;
          }
          .summary-table th {
            text-align: right;
          }
          .total {
            font-weight: bold;
          }
          .other-comments {
            margin-top: 30px;
            padding: 10px;
            background-color: #f9f9f9;
          }
          .other-comments ol {
            padding-left: 20px;
          }
          .payment-info {
            margin-top: 20px;
            text-align: right;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="company-info">
              <strong>${this.companyDetails.name}</strong><br>
              ${this.companyDetails.address}<br>
              ${this.companyDetails.city}, ${this.companyDetails.state} - ${this.companyDetails.pincode}<br>
              Phone: ${this.companyDetails.phone}<br>
              Website: www.jupiterkingtechnologies.com
            </div>
            <div class="invoice-info">
              <h2 class="invoice-title">INVOICE</h2>
              <table>
                <tr>
                  <td><strong>DATE</strong></td>
                  <td>${formattedDate}</td>
                </tr>
                <tr>
                  <td><strong>INVOICE #</strong></td>
                  <td>${expense.invoiceNumber}</td>
                </tr>
              </table>
            </div>
          </div>

          <div class="bill-to">
            <strong>BILL TO</strong><br>
            <p><strong>Bill To:</strong><br>${expense.billingName}<br>${expense.billingAddress}</p> <!-- 🆕 Shows new billing fields -->
          </div>

          <table class="details-table">
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

          <table class="summary-table">
            <tbody>
              <tr>
                <th>Subtotal</th>
                <td class="amount">${subtotal.toFixed(2)}</td>
              </tr>
              <tr class="total">
                <th>TOTAL</th>
                <td class="amount">&#8377;${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="payment-info">
            Make all checks payable to<br>
            JupiterKing Technologies Pvt Ltd
          </div>

          <div class="footer">
            If you have any questions about this invoice, please contact<br>
            [${this.companyDetails.name},${this.companyDetails.phone}, ${this.companyDetails.email}]<br>
            Thank You For Your Business!
          </div>
        </div>
      </body>
      </html>
    `;
  }
  // createInvoiceContent(expense: Expense): string {
  //   const date = new Date().toLocaleDateString();

  //   return `
  //     <!DOCTYPE html>
  //     <html>
  //     <head>
  //       <style>
  //         body { font-family: Arial, sans-serif; margin: 40px; }
  //         .header { text-align: center; margin-bottom: 30px; }
  //         .company-details { margin-bottom: 30px; }
  //         .invoice-details { margin-bottom: 30px; }
  //         .expense-details { margin-bottom: 30px; }
  //         table { width: 100%; border-collapse: collapse; }
  //         th, td { padding: 10px; border: 1px solid #ddd; }
  //         .total { margin-top: 20px; text-align: right; }
  //       </style>
  //     </head>
  //     <body>
  //       <div class="header">
  //         <h1>INVOICE</h1>
  //       </div>

  //       <div class="company-details">
  //         <h2>${this.companyDetails.name}</h2>
  //         <p>${this.companyDetails.address}</p>
  //         <p>${this.companyDetails.city}, ${this.companyDetails.state} </p>
  //         <p>Pincode: ${this.companyDetails.pincode}</p>
  //         <p>Phone: ${this.companyDetails.phone}</p>
  //         <p>Email: ${this.companyDetails.email}</p>
  //       </div>

  //       <div class="invoice-details">
  //         <p><strong>Invoice Number:</strong> ${expense.invoiceNumber}</p>
  //         <p><strong>Date:</strong> ${date}</p>
  //       </div>

  //       <div class="expense-details">
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>Expense Type</th>
  //               <th>Description</th>
  //               <th>Amount</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             <tr>
  //               <td>${expense.expenseType}</td>
  //               <td>${expense.expenseDescription}</td>
  //               <td>$${expense.expenseAmount.toFixed(2)}</td>
  //             </tr>
  //           </tbody>
  //         </table>

  //         <div class="total">
  //           <h3>Total Amount: $${expense.expenseAmount.toFixed(2)}</h3>
  //         </div>
  //       </div>
  //     </body>
  //     </html>
  //   `;
  // }

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