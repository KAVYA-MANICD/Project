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
    clientName?: string;
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
    filteredInvoices: Invoice[] = [];
    clients: Client[] = [];
    searchText: string = '';
    isInvoiceModalOpen = false;
    loading = false;
    successMessage: string | null = null;
    errorMessage: string | null = null;

    isWarningModalOpen = false;
    warningMessage = '';
    private invoicePayloadForProceed: Invoice | null = null;

    

    private invoiceApiUrl = 'http://localhost:8080/invoices';
    private clientsApiUrl = 'http://localhost:8080/clients/all';

    companyDetails = {
        name: 'JupiterKing Technologies Pvt Ltd.',
        address: 'Nrupathunga Road, Kuvempunagar',
        city: 'Mysore',
        state: 'Karnataka',
        pincode: '570023',
        phone: '91+ 7259489277',
        email: 'jupiterkingtechnology@gmail.com'
    };

    constructor(private fb: FormBuilder, private http: HttpClient) {
        this.invoiceForm = this.fb.group({
            client: ['', Validators.required],
            product: ['', Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]],
            rate: [0, [Validators.required, Validators.min(0)]],
            description: [''],
            date: [new Date().toISOString().split('T')[0], Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadClients();
    }

    loadClients(): void {
        this.http.get<Client[]>(this.clientsApiUrl).subscribe({
            next: (data) => {
                this.clients = data;
                this.loadInvoices();
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
                this.filteredInvoices = this.invoices;
            },
            error: (err) => {
                console.error('Failed to fetch invoices:', err);
            }
        });
    }

    filterInvoices(): void {
        const searchText = this.searchText.toLowerCase();
        this.filteredInvoices = this.invoices.filter(invoice => {
            const clientName = invoice.clientName?.toLowerCase() || '';
            const productName = invoice.productOrService?.toLowerCase() || '';
            return clientName.includes(searchText) || productName.includes(searchText);
        });
    }

    openInvoiceModal(): void {
        this.invoiceForm.reset({
            client: '',
            product: '',
            quantity: 1,
            rate: 0,
            description: '',
            date: new Date().toISOString().split('T')[0]
        });
        this.successMessage = null;
        this.errorMessage = null;
        this.isInvoiceModalOpen = true;
    }

    closeInvoiceModal(): void {
        this.isInvoiceModalOpen = false;
    }

    closeWarningModal(): void {
        this.isWarningModalOpen = false;
        this.invoicePayloadForProceed = null;
    }

    proceedWithInvoiceCreation(): void {
        if (this.invoicePayloadForProceed) {
            this._createInvoice(this.invoicePayloadForProceed, true);
            this.closeWarningModal();
        }
    }

    calculateSubtotal(): number {
        const { quantity, rate } = this.invoiceForm.value;
        return quantity * rate;
    }

    calculateTaxes(): number {
        return this.calculateSubtotal() * 0.18;
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
            description: formValues.description,
            date: formValues.date
        };

        this.http.post<any>(`${this.invoiceApiUrl}/validate`, invoicePayload).subscribe({
            next: (response) => {
                if (response.status === 'VALID') {
                    this._createInvoice(invoicePayload);
                } else {
                    this.warningMessage = response.message;
                    this.invoicePayloadForProceed = invoicePayload;
                    this.isWarningModalOpen = true;
                    this.loading = false;
                }
            },
            error: (err) => {
                console.error('Error validating invoice:', err);
                this.errorMessage = 'Error validating invoice. Please try again.';
                this.loading = false;
            }
        });
    }

    private _createInvoice(invoice: Invoice, force = false): void {
        this.loading = true;
        let url = `${this.invoiceApiUrl}/add`;
        if (force) {
            url += '?force=true';
        }

        this.http.post<Invoice>(url, invoice).subscribe({
            next: (newInvoice) => {
                const client = this.clients.find(c => c.id === newInvoice.client.id);
                newInvoice.clientName = client?.companyName || 'Unknown';
                this.invoices.push(newInvoice);
                this.filterInvoices();
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
        const invoice = this.invoices.find(i => i.id === invoiceId);
        const label = invoice?.invoiceNumber ? `Invoice #${invoice.invoiceNumber}` : 'this invoice';
        const confirmed = window.confirm(`Are you sure you want to delete ${label}? This action cannot be undone.`);
        if (!confirmed) {
            return;
        }

        this.http.delete(`${this.invoiceApiUrl}/${invoiceId}`).subscribe({
            next: () => {
                this.invoices = this.invoices.filter(i => i.id !== invoiceId);
                this.filterInvoices();
            },
            error: (err) => {
                console.error('Error deleting invoice:', err);
            }
        });
    }

    // voice search removed

    downloadInvoice(invoiceId: number): void {
        const invoice = this.invoices.find(inv => inv.id === invoiceId);
        if (!invoice) {
            this.errorMessage = 'Invoice not found!';
            return;
        }

        const htmlContent = this.createInvoiceContent(invoice);
        const printWindow = window.open('', '_blank', 'width=800,height=600');

        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();

            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };
        } else {
            this.errorMessage = 'Unable to open print window.';
        }
    }

    generateInvoice(invoiceId: number): void {
        const invoice = this.invoices.find(inv => inv.id === invoiceId);
        if (!invoice) {
            this.errorMessage = 'Invoice not found!';
            return;
        }

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(this.createInvoiceContent(invoice));
            printWindow.document.close();
            printWindow.focus();
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
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 14px; color: #333; }
            .invoice-container { max-width: 800px; margin: auto; padding: 20px; }
            header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
            .company-details { font-weight: bold; font-size: 18px; }
            .invoice-details { text-align: right; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f4f4f4; }
            .totals { margin-top: 20px; float: right; width: 300px; }
            .totals table { border: none; }
            .totals th, .totals td { border: none; padding: 5px 10px; }
            .totals th { text-align: left; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #888; }
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
                    <div>Invoice No: ${invoice.invoiceNumber || 'N/A'}</div>
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
    </html>`;
}
}
