import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PayrollService } from '../payroll.service';
import { NavbarComponent } from '../navbar/navbar.component';

interface PayrollData {
  id?: number;
  employeeName: string;
  employeeId: string;
  basicSalary: number;
  allowanceAmount: number;
  deductions: number;
  totalAmount: number;
  // New fields
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  transactionId: string;
  transactionDate: Date;
 
}

@Component({
  selector: 'app-jupiter',
  imports: [ReactiveFormsModule, CommonModule,RouterModule,FormsModule,NavbarComponent],
  templateUrl: './jupiter.component.html',
  styleUrl: './jupiter.component.css'
})
export class JupiterComponent {
  payrollForm!: FormGroup;
     isPopupOpen = false;
     loading = false;
     payrolls: any[] = [];  
     
   
     constructor(private fb: FormBuilder, private payrollService: PayrollService, private http:HttpClient) {}
   
     ngOnInit(): void {
       this.initializeForm();
       this.loadPayrolls();  
     }
   
     initializeForm() {
      this.payrollForm = this.fb.group({
        // Existing fields
        employeeName: ['', Validators.required],
        employeeId: ['', Validators.required],
        basicSalary: ['', [Validators.required, Validators.min(0)]],
        allowanceAmount: ['', [Validators.required, Validators.min(0)]],
        deductions: ['', [Validators.required, Validators.min(0)]],
        // New fields
        bankName: ['', Validators.required],
        accountNumber: ['', [Validators.required, Validators.pattern('^[0-9]{9,18}$')]],
        ifscCode: ['', [Validators.required, Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],
        transactionId: ['', Validators.required],
        transactionDate: ['', Validators.required],
        paymentStatus: ['Pending', Validators.required]
      });
    }
  
   
     openPopup() {
       this.isPopupOpen = true;
     }
   
     closePopup() {
       this.isPopupOpen = false;
     }
   
     isFieldInvalid(fieldName: string): boolean {
       const field = this.payrollForm.get(fieldName);
       return field ? field.invalid && (field.dirty || field.touched) : false;
     }
   
     calculateTotal(): number {
       if (this.payrollForm.valid) {
         const values = this.payrollForm.value;
         return Number(values.basicSalary) + Number(values.allowanceAmount) - Number(values.deductions);
       }
       return 0;
     }
   
     onSubmit() {
       if (this.payrollForm.valid) {
         this.loading = true;
         const payrollData = this.payrollForm.value;
         payrollData.totalAmount = this.calculateTotal();
   
         this.payrollService.createPayroll(payrollData).subscribe(
           (response) => {
             console.log('Payroll Created:', response);
             this.loading = false;
             this.closePopup();
             this.payrollForm.reset();
             this.loadPayrolls();  
           },
           (error) => {
             console.error('Error creating payroll:', error);
             this.loading = false;
           }
         );
       }
     }
   
     loadPayrolls() {
       this.payrollService.getPayrolls().subscribe(
         (data) => {
           this.payrolls = data;
         },
         (error) => {
           console.error('Error loading payrolls:', error);
         }
       );
     }
   
   
     deletePayroll(id: number) {
       if (confirm('Are you sure you want to delete this payroll?')) {
         this.payrollService.deletePayroll(id).subscribe(
           () => {
             this.payrolls = this.payrolls.filter(payroll => payroll.id !== id);
             console.log('Payroll deleted successfully');
           },
           error => {
             console.error('Error deleting payroll:', error);
           }
         );
       }
     }
   
     downloadPDF(id: number) {
       this.payrollService.generatePDF(id).subscribe(
         (blob: Blob) => {
           const url = window.URL.createObjectURL(blob);
           const link = document.createElement('a');
           link.href = url;
           link.download = `payroll_invoice_${id}.pdf`;
           link.click();
           window.URL.revokeObjectURL(url);
         },
         error => {
           console.error('Error downloading PDF:', error);
         }
       );
     }
   
     downloadCSV(id: number) {
       this.payrollService.downloadCSV1(id).subscribe(
         () => {
           console.log('CSV file has been saved to the specified location');
         },
         error => {
           console.error('Error downloading CSV:', error);
         }
       );
     }
   }