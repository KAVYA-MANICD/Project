import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense, PayrollData } from './models/payroll.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  private apiUrl = 'http://localhost:8080/api/payroll';

  private expenseApiUrl = 'http://localhost:8080/api/expenses1';

  constructor(private http: HttpClient) {}

  // getPayrolls(): Observable<PayrollData[]> {
  //   return this.http.get<PayrollData[]>(this.apiUrl);
  // }

  // createPayroll(payroll: PayrollData): Observable<PayrollData> {
  //   return this.http.post<PayrollData>(this.apiUrl, payroll);
  // }

  // // deletePayroll(id: number): Observable<void> {
  // //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // // }
  // deletePayroll(id: number): Observable<void> {
  //     return this.http.delete<void>(`${this.apiUrl}/payroll/${id}`);
  //   }

  getPayrolls(): Observable<PayrollData[]> {
    return this.http.get<PayrollData[]>(this.apiUrl);
  }

  // Create new payroll
  createPayroll(payroll: PayrollData): Observable<PayrollData> {
    return this.http.post<PayrollData>(this.apiUrl, payroll);
  }

  // Delete payroll
  deletePayroll(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Generate and download PDF
  generatePDF(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/generate-pdf/${id}`, {
      responseType: 'blob'
    });
  }


  downloadCSV1(id: number): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/download-csv/${id}`);
  }

  // Get payroll by ID
  getPayrollById(id: number): Observable<PayrollData> {
    return this.http.get<PayrollData>(`${this.apiUrl}/${id}`);
  }

  // Update payroll
  updatePayroll(id: number, payroll: PayrollData): Observable<PayrollData> {
    return this.http.put<PayrollData>(`${this.apiUrl}/${id}`, payroll);
  }

  // Get payrolls by employee ID
  getPayrollsByEmployeeId(employeeId: string): Observable<PayrollData[]> {
    return this.http.get<PayrollData[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  // this.http.delete(`${this.apiUrl}/payroll/${id}`)
  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post('http://localhost:8080/api/invoice', invoiceData);
  }

 
  // createExpense(expenseData: any): Observable<any> {
  //   return this.http.post<any>(this.expenseApiUrl, expenseData);
  // }

  // getExpenses(): Observable<Expense[]> {
  //   return this.http.get<Expense[]>(this.expenseApiUrl);  // Fetch expenses from backend
  // }

  createExpense(expenseData: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.expenseApiUrl, expenseData);
}

getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.expenseApiUrl);
}

deleteExpense(id: number): Observable<any> {
  return this.http.delete(`${this.expenseApiUrl}/${id}`);
}

// downloadCSV(csvContent: string, invoiceNumber: string): Observable<any> {
//   return this.http.post(`${this.expenseApiUrl}/download-csv`, {
//     content: csvContent,
//     invoiceNumber: invoiceNumber
//   });
// }
downloadCSV(csvContent: string, invoiceNumber: string): Observable<HttpResponse<Blob>> {
  return this.http.post(`${this.expenseApiUrl}/download-csv`, 
    { content: csvContent, invoiceNumber: invoiceNumber },
    {
      observe: 'response',
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'text/csv'
      })
    }
  );
}


}


