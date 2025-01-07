export interface PayrollData {
    id?: number;
    employeeName: string;
    employeeId: string;
    basicSalary: number;
    
    allowanceAmount: number;
    deductions: number;
    totalAmount: number;
    invoiceNumber: string;
  }


  export interface Expense {
    id: number;
    expenseType: string;
    expenseDescription: string;
    expenseAmount: number;
    invoiceNumber: string;
    expenseDate: string;
}