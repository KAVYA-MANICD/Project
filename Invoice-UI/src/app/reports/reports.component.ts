import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HttpClientModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  constructor(private http: HttpClient) {}

  generateClientReport() {
    this.http.get<any[]>('http://localhost:8080/clients/all').subscribe({
      next: (clients) => {
        const doc = new jsPDF();
        (doc as any).autoTable({
          head: [['ID', 'Name', 'Company', 'Email', 'Phone']],
          body: clients.map(client => [client.id, client.name, client.companyName, client.email, client.phone]),
        });
        doc.save('client-report.pdf');
      },
      error: (err) => {
        console.error('Error generating client report:', err);
      }
    });
  }

  generateInvoiceReport() {
    this.http.get<any[]>('http://localhost:8080/invoices/all').subscribe({
      next: (invoices) => {
        const doc = new jsPDF();
        (doc as any).autoTable({
          head: [['ID', 'Invoice Number', 'Client ID', 'Product/Service', 'Total']],
          body: invoices.map(invoice => [invoice.id, invoice.invoiceNumber, invoice.client.id, invoice.productOrService, invoice.total]),
        });
        doc.save('invoice-report.pdf');
      },
      error: (err) => {
        console.error('Error generating invoice report:', err);
      }
    });
  }

  generateSummaryReport() {
    this.http.get<any>('http://localhost:8080/analytics/overview').subscribe({
      next: (summary) => {
        const doc = new jsPDF();
        doc.text('Smart Analytics Summary', 14, 16);
        let y = 30;
        for (const key in summary) {
          if (summary.hasOwnProperty(key)) {
            doc.text(`${this.formatKey(key)}: ${summary[key]}`, 14, y);
            y += 10;
          }
        }
        doc.save('summary-report.pdf');
      },
      error: (err) => {
        console.error('Error generating summary report:', err);
      }
    });
  }

  private formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }
}
