import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

interface Client {
  id: number;
  companyName: string;
}

interface Invoice {
  id?: number;
  invoiceNumber?: string;
  client: { id: number };
  clientName?: string; // for display
  productOrService: string;
  quantity: number;
  rate: number;
  subtotal?: number;
  taxes?: number;
  total?: number;
  date?: string;
  description?: string;
}

@Component({
  selector: 'app-client-invoice-management',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule, NavbarComponent],
  templateUrl: './client-invoice-management.component.html',
  styleUrls: ['./client-invoice-management.component.css']
})
export class ClientInvoiceManagementComponent implements OnInit {
  invoiceForm: FormGroup;
  invoices: Invoice[] = [];
  clients: Client[] = [];
  isInvoiceModalOpen = false;
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  private invoiceApiUrl = 'http://localhost:8080/invoices';
  private clientsApiUrl = 'http://localhost:8080/clients/all';

  companyDetails = {
    name: 'Your Company Name Pvt Ltd.',
    address: 'Your Address Line 1',
    city: 'Your City',
    state: 'Your State',
    pincode: '123456',
    phone: '123-456-7890',
    email: 'contact@yourcompany.com'
  };

  generatedInvoiceHtml: string | null = null; // holds generated invoice HTML to show in UI

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.invoiceForm = this.fb.group({
      client: ['', Validators.required],
      product: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      rate: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.http.get<Client[]>(this.clientsApiUrl).subscribe({
      next: (data) => {
        this.clients = data;
        this.loadInvoices(); // Load invoices after clients loaded
      },
      error: (err) => {
        console.error('Failed to fetch clients:', err);
      }
    });
  }

  loadInvoices(): void {
    this.http.get<Invoice[]>(`${this.invoiceApiUrl}/all`).subscribe({
      next: (data) => {
        this.invoices = data.map(inv => {
          const client = this.clients.find(c => c.id === inv.client.id);
          return {
            ...inv,
            clientName: client?.companyName || 'Unknown'
          };
        });
      },
      error: (err) => {
        console.error('Failed to fetch invoices:', err);
      }
    });
  }

  openInvoiceModal(): void {
    this.invoiceForm.reset({
      client: '',
      product: '',
      quantity: 1,
      rate: 0,
      description: ''
    });
    this.successMessage = null;
    this.errorMessage = null;
    this.isInvoiceModalOpen = true;
    this.generatedInvoiceHtml = null; // clear any previously generated invoice
  }

  closeInvoiceModal(): void {
    this.isInvoiceModalOpen = false;
    this.generatedInvoiceHtml = null;
  }

  calculateSubtotal(): number {
    const { quantity, rate } = this.invoiceForm.value;
    return quantity * rate;
  }

  calculateTaxes(): number {
    return this.calculateSubtotal() * 0.18; // 18% GST
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTaxes();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.invoiceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onInvoiceSubmit(): void {
    if (this.invoiceForm.invalid) return;

    this.loading = true;

    const formValues = this.invoiceForm.value;
    const subtotal = this.calculateSubtotal();
    const taxes = this.calculateTaxes();
    const total = this.calculateTotal();

    const invoicePayload: Invoice = {
      client: { id: formValues.client },
      productOrService: formValues.product,
      quantity: formValues.quantity,
      rate: formValues.rate,
      subtotal,
      taxes,
      total,
      description: formValues.description
    };

    this.http.post<Invoice>(`${this.invoiceApiUrl}/add`, invoicePayload).subscribe({
      next: (newInvoice) => {
        const client = this.clients.find(c => c.id === newInvoice.client.id);
        newInvoice.clientName = client?.companyName || 'Unknown';
        this.invoices.push(newInvoice);
        this.successMessage = 'Invoice created successfully!';
        this.closeInvoiceModal();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error creating invoice:', err);
        this.errorMessage = 'Error creating invoice. Please try again.';
        this.loading = false;
      }
    });
  }

  deleteInvoice(invoiceId: number): void {
    this.http.delete(`${this.invoiceApiUrl}/${invoiceId}`).subscribe({
      next: () => {
        this.invoices = this.invoices.filter(i => i.id !== invoiceId);
      },
      error: (err) => {
        console.error('Error deleting invoice:', err);
      }
    });
  }

  downloadInvoice(invoiceId: number): void {
    // Opens a new tab to download the invoice PDF or file from the backend
    window.open(`${this.invoiceApiUrl}/${invoiceId}/download`, '_blank');
  }

  generateInvoice(invoiceId: number): void {
    // Find invoice to generate
    const invoice = this.invoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
      this.errorMessage = 'Invoice not found!';
      return;
    }
    this.generatedInvoiceHtml = this.createInvoiceContent(invoice);
    
    // Optionally, open a new print window as well
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(this.generatedInvoiceHtml);
      printWindow.document.close();
      printWindow.focus();
      // Uncomment to auto-print
      // printWindow.print();
    }
  }

  private createInvoiceContent(invoice: Invoice): string {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US');
    const subtotal = invoice.subtotal ?? this.calculateSubtotal();
    const taxes = invoice.taxes ?? this.calculateTaxes();
    const total = invoice.total ?? this.calculateTotal();

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice #${invoice.invoiceNumber || ''}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 14px;
            color: #333;
          }
          .invoice-container {
            max-width: 800px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ccc;
          }
          header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }
          .company-details {
            font-weight: bold;
            font-size: 18px;
          }
          .invoice-details {
            text-align: right;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background: #f4f4f4;
          }
          .totals {
            margin-top: 20px;
            float: right;
            width: 300px;
          }
          .totals table {
            border: none;
          }
          .totals th, .totals td {
            border: none;
            padding: 5px 10px;
          }
          .totals th {
            text-align: left;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <header>
            <div class="company-details">
              <div>${this.companyDetails.name}</div>
              <div>${this.companyDetails.address}</div>
              <div>${this.companyDetails.city}, ${this.companyDetails.state} - ${this.companyDetails.pincode}</div>
              <div>Phone: ${this.companyDetails.phone}</div>
              <div>Email: ${this.companyDetails.email}</div>
            </div>
            <div class="invoice-details">
              <h2>Invoice</h2>
              <div>Date: ${formattedDate}</div>
              <div>Invoice #: ${invoice.invoiceNumber || 'N/A'}</div>
            </div>
          </header>

          <section>
            <h3>Bill To:</h3>
            <p>${invoice.clientName || 'Unknown Client'}</p>
          </section>

          <table>
            <thead>
              <tr>
                <th>Product/Service</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${invoice.productOrService}</td>
                <td>${invoice.description || '-'}</td>
                <td>${invoice.quantity}</td>
                <td>${invoice.rate.toFixed(2)}</td>
                <td>${subtotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            <table>
              <tr>
                <th>Taxes (18% GST):</th>
                <td>${taxes.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Total:</th>
                <td><strong>${total.toFixed(2)}</strong></td>
              </tr>
            </table>
          </div>

          <div style="clear: both;"></div>

          <div class="footer">
            Thank you for your business!<br />
            If you have questions, contact us at ${this.companyDetails.email}
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
