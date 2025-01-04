import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SalaryInvoiceComponent } from './salary-invoice/salary-invoice.component';
import { SalInvoiceComponent } from './sal-invoice/sal-invoice.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { HomeComponent } from './home/home.component';
import { JupiterComponent } from './jupiter/jupiter.component';
import { PayrollInvoiceComponentComponent } from './payroll-invoice-component/payroll-invoice-component.component';
import { PayrollListComponent } from './payroll-list/payroll-list.component';
import { PayrollformComponent } from './payrollform/payrollform.component';
import { UtilityExpensesComponent } from './utility-expenses/utility-expenses.component';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'login',component:LoginComponent},
    {path:'dashboard',component:DashboardComponent},
    {path:'invoice1',component:SalaryInvoiceComponent},
    {path:'salinvoice',component:SalInvoiceComponent},
    {path:'compinvoice',component:InvoiceComponent},
    {path:'home',component:HomeComponent},
    {path:'jupiter',component:JupiterComponent},
    {path:'payroll',component:PayrollInvoiceComponentComponent},
    {path:'payrolllist',component:PayrollListComponent},
    {path:'payrollform',component:PayrollformComponent},
    {path:'utility',component:UtilityExpensesComponent},
];
