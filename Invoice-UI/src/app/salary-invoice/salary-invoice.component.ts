import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-salary-invoice',
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './salary-invoice.component.html',
  styleUrl: './salary-invoice.component.css'
})
export class SalaryInvoiceComponent implements OnInit {
  invoiceForm: FormGroup;
  invoices: any[] = [];
  apiUrl = 'http://localhost:8080/api/invoices'; // Backend API URL

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.invoiceForm = this.fb.group({
      employeeName: ['', Validators.required],
      salary: [null, [Validators.required, Validators.min(0)]],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchInvoices(); // Fetch existing invoices on load
  }

  // Method triggered on form submission
  onSubmit() {
    if (this.invoiceForm.valid) {
      const invoiceData = this.invoiceForm.value;

      // Send invoice data to backend
      this.http.post(this.apiUrl, invoiceData).subscribe(
        (response) => {
          alert('Invoice generated successfully!');
          this.invoiceForm.reset(); // Reset the form
          this.fetchInvoices(); // Refresh invoice list
        },
        (error) => {
          console.error('Error generating invoice', error);
        }
      );
    } else {
      alert('Please fill out the form correctly.');
    }
  }

  // Fetch invoices from backend
  fetchInvoices() {
    this.http.get<any[]>(this.apiUrl).subscribe((data) => {
      this.invoices = data;
    });
  }

  // Save invoice to backend and download as CSV
  saveInvoice() {
    if (this.invoiceForm.valid) {
      const invoiceData = this.invoiceForm.value;

      // Save to backend
      this.http.post(this.apiUrl, invoiceData).subscribe(
        (response) => {
          alert('Invoice saved to database successfully!');
          this.fetchInvoices(); // Refresh the list
        },
        (error) => {
          console.error('Error saving invoice', error);
        }
      );

      // Generate and download CSV
      this.downloadCSV(invoiceData);
    }
  }

  // Delete invoice by ID
  deleteInvoice(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      alert('Invoice deleted successfully!');
      this.fetchInvoices(); // Refresh the list
    });
  }

  // Generate and download CSV file
  downloadCSV(invoice: any) {
    const csvData = `Employee Name,Salary,Date\n${invoice.employeeName},${invoice.salary},${invoice.date}`;
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = 'invoice.csv';
    anchor.href = url;
    anchor.click();
  }
}