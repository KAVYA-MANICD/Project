import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PayrollData } from '../models/payroll.model';
import jsPDF from 'jspdf';
import { PayrollService } from '../payroll.service';
import * as Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payroll-list',
  imports: [CommonModule,RouterModule],
  templateUrl: './payroll-list.component.html',
  styleUrl: './payroll-list.component.css'
})
export class PayrollListComponent implements OnInit {
 

  payrolls: PayrollData[] = [];
  loading = false;
  errorMessage = '';

  constructor(private payrollService: PayrollService) {}

  ngOnInit() {
    this.loadPayrolls();
  }

  loadPayrolls() {
    this.loading = true;
    this.payrollService.getPayrolls().subscribe({
      next: (data) => {
        this.payrolls = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load payrolls';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  generateInvoice() {
    // Example for generating an invoice (send request to backend to save)
    const invoiceData = {
      companyName: 'Your Company Name',
      companyAddress: 'Your Company Address',
      payrolls: this.payrolls
    };

    // Call service to save invoice data (backend integration needed)
    this.payrollService.createInvoice(invoiceData).subscribe({
      next: (response) => {
        alert('Invoice generated and saved successfully!');
      },
      error: (err) => {
        this.errorMessage = 'Failed to generate invoice';
        console.error('Error:', err);
      }
    });
  }


  downloadPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Invoice', 20, 20);

    // Company Information
    doc.setFontSize(12);
    doc.text('Company Name: Jupiter King Technologies', 20, 30);
    doc.text('Company Address: Kuvempunagar', 20, 40);

    // Payroll data
    let y = 50;
    this.payrolls.forEach((payroll) => {
      doc.text(`Employee: ${payroll.employeeName}`, 20, y);
      doc.text(`ID: ${payroll.employeeId}`, 20, y + 10);
      doc.text(`Basic Salary: $${payroll.basicSalary}`, 20, y + 20);
      doc.text(`Allowance: $${payroll.allowanceAmount}`, 20, y + 30);
      doc.text(`Deductions: $${payroll.deductions}`, 20, y + 40);
      doc.text(`Total: $${payroll.totalAmount}`, 20, y + 50);
      y += 60;
    });

    // Save PDF
    doc.save('invoice.pdf');
  }

  downloadCSV() {
    const payrollData = this.payrolls.map(payroll => ({
      Employee: payroll.employeeName,
      ID: payroll.employeeId,
      'Basic Salary': payroll.basicSalary,
      Allowance: payroll.allowanceAmount,
      Deductions: payroll.deductions,
      Total: payroll.totalAmount
    }));

    const csv = Papa.unparse(payrollData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'payroll-invoice.csv');
  }

  deletePayroll(id: number) {
    if (confirm('Are you sure you want to delete this payroll?')) {
      this.loading = true;
      this.payrollService.deletePayroll(id).subscribe({
        next: () => {
          this.loadPayrolls();
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete payroll';
          this.loading = false;
          console.error('Error:', err);
        }
      });
    }
  }
}




// //   payrolls: PayrollData[] = [];
// //   loading = false;
// //   errorMessage = '';

// //   constructor(private payrollService: PayrollService) {}

// //   ngOnInit() {
// //     this.loadPayrolls();
// //   }

// //   loadPayrolls() {
// //     this.loading = true;
// //     this.payrollService.getPayrolls().subscribe({
// //       next: (data) => {
// //         this.payrolls = data;
// //         this.loading = false;
// //       },
// //       error: (err) => {
// //         this.errorMessage = 'Failed to load payrolls';
// //         this.loading = false;
// //         console.error('Error:', err);
// //       }
// //     });
// //   }

// //   deletePayroll(id: number) {
// //     if (confirm('Are you sure you want to delete this payroll?')) {
// //       this.loading = true;
// //       this.payrollService.deletePayroll(id).subscribe({
// //         next: () => {
// //           this.loadPayrolls();
// //           this.loading = false;
// //         },
// //         error: (err) => {
// //           this.errorMessage = 'Failed to delete payroll';
// //           this.loading = false;
// //           console.error('Error:', err);
// //         }
// //       });
// //     }
// //   }
// }

