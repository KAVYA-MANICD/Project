import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

interface Invoice {
  id?: number;
  clientId: number;
  clientName?: string; // Added clientName property
  totalAmount: number;
  status: string;
  date: string;
  lineItems: LineItem[];
}

interface LineItem {
  name: string;
  quantity: number;
  rate: number;
}

@Component({
  selector: 'app-client-invoice-management',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule, NavbarComponent],
  templateUrl: './client-invoice-management.component.html',
  styleUrls: ['./client-invoice-management.component.css']
})
export class ClientInvoiceManagementComponent implements OnInit {
  invoiceForm: FormGroup;
  invoices: Invoice[] = [];
  clients: any[] = []; 
  lineItems: LineItem[] = [{ name: '', quantity: 1, rate: 0 }];
  isInvoiceModalOpen = false;
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  private apiUrl = 'https://your-api-url.com/api/invoices'; // Replace with your API URL

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.invoiceForm = this.fb.group({
      client: ['', Validators.required],
      dueDate: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadInvoices();
  }

  loadClients(): void {
    this.http.get<any[]>('https://your-api-url.com/api/clients').subscribe(
      (data) => {
        this.clients = data;
      },
      (error) => {
        console.error('Error fetching clients', error);
      }
    );
  }

  loadInvoices(): void {
    this.http.get<Invoice[]>(this.apiUrl).subscribe(
      (data) => {
        this.invoices = data;
        // Optionally, you can map client names here if needed
        this.invoices.forEach(invoice => {
          const client = this.clients.find(c => c.id === invoice.clientId);
          invoice.clientName = client ? client.name : 'Unknown Client'; // Set clientName based on clientId
        });
      },
      (error) => {
        console.error('Error fetching invoices', error);
      }
    );
  }

  openInvoiceModal(): void {
    this.isInvoiceModalOpen = true;
    this.invoiceForm.reset();
    this.lineItems = [{ name: '', quantity: 1, rate: 0 }];
    this.successMessage = null;
    this.errorMessage = null;
  }

  closeInvoiceModal(): void {
    this.isInvoiceModalOpen = false;
  }

  addLineItem(): void {
    this.lineItems.push({ name: '', quantity: 1, rate: 0 });
  }

  removeLineItem(index: number): void {
    this.lineItems.splice(index, 1);
  }

  calculateTotal(): number {
    return this.lineItems.reduce((total, item) => total + (item.quantity * item.rate), 0);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.invoiceForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onInvoiceSubmit(): void {
    if (this.invoiceForm.invalid) {
      return;
    }

    this.loading = true;
    const invoiceData: Invoice = {
      clientId: this.invoiceForm.value.client,
      totalAmount: this.calculateTotal(),
      status: 'Draft',
      date: new Date().toISOString(),
      lineItems: this.lineItems,
    };

    this.http.post<Invoice>(this.apiUrl, invoiceData).subscribe(
      (response) => {
        this.loading = false;
        this.successMessage = 'Invoice created successfully!';
        this.invoices.push(response);
        this.closeInvoiceModal();
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Error creating invoice. Please try again.';
        console.error('Error creating invoice', error);
      }
    );
  }

  deleteInvoice(invoiceId: number): void {
    this.http.delete(`${this.apiUrl}/${invoiceId}`).subscribe(
      () => {
        this.invoices = this.invoices.filter(invoice => invoice.id !== invoiceId);
      },
      (error) => {
        console.error('Error deleting invoice', error);
      }
    );
  }

  downloadInvoice(invoiceId: number): void {
    window.open(`${this.apiUrl}/${invoiceId}/download`, '_blank');
  }
}
