import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {
  invoiceForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.invoiceForm = this.fb.group({
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      clientName: ['', Validators.required],
      clientAddress: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      items: this.fb.array([])
    });

    this.addItem(); // Add first item by default
  }

  get items() {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem() {
    const itemForm = this.fb.group({
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
    this.items.push(itemForm);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  calculateSubTotal(): number {
    return this.items.controls.reduce((total, item) => {
      return total + (item.get('price')?.value * item.get('quantity')?.value || 0);
    }, 0);
  }

  calculateTotal(): number {
    return this.calculateSubTotal();
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      const invoiceData = {
        ...this.invoiceForm.value,
        subTotal: this.calculateSubTotal(),
        total: this.calculateTotal()
      };

      this.http.post('http://localhost:8080/api/invoices', invoiceData).subscribe(
        response => {
          alert('Invoice generated successfully!');
        },
        error => {
          alert('Error generating invoice: ' + error.message);
        }
      );
    }
  }

  downloadPDF() {
    this.http.get('http://localhost:8080/api/invoices/pdf', { responseType: 'blob' })
      .subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice_${new Date().getTime()}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }

  downloadCSV() {
    this.http.get('http://localhost:8080/api/invoices/csv', { responseType: 'blob' })
      .subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoices_${new Date().getTime()}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }

}
