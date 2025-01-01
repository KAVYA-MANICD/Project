import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PayrollData } from './models/payroll.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  private apiUrl = 'http://localhost:8080/api/payroll';

  constructor(private http: HttpClient) {}

  getPayrolls(): Observable<PayrollData[]> {
    return this.http.get<PayrollData[]>(this.apiUrl);
  }

  createPayroll(payroll: PayrollData): Observable<PayrollData> {
    return this.http.post<PayrollData>(this.apiUrl, payroll);
  }

  deletePayroll(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post('http://localhost:8080/api/invoice', invoiceData);
  }

  // createPayroll(payrollData: PayrollData): Observable<PayrollData> {
  //   // Updated the URL to point to the correct backend API URL
  //   return this.http.post<PayrollData>(this.apiUrl, payrollData);
  // }

}
