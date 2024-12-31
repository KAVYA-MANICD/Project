import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SalaryInvoiceComponent } from './salary-invoice/salary-invoice.component';
import { SalInvoiceComponent } from './sal-invoice/sal-invoice.component';
import { InvoiceComponent } from './invoice/invoice.component';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'login',component:LoginComponent},
    {path:'dashboard',component:DashboardComponent},
    {path:'invoice1',component:SalaryInvoiceComponent},
    {path:'invoice2',component:SalInvoiceComponent},
    {path:'invoice',component:InvoiceComponent},
];
