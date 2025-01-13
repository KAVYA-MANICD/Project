export interface PayrollData {
    // id?: number;
    // employeeName: string;
    // employeeId: string;
    // basicSalary: number;
    // allowanceAmount: number;
    // deductions: number;
    // totalAmount: number;
    // invoiceNumber: string;


    id?: number;
    employeeName: string;
    employeeId: string;
    basicSalary: number;
    allowanceAmount: number;
    deductions: number;
    totalAmount: number;
    // New fields
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    transactionId: string;
    transactionDate: Date;
    // paymentStatus: 'Pending' | 'Completed' | 'Failed';
  }


  export interface Expense {
    id: number;
    expenseType: string;
    expenseDescription: string;
    expenseAmount: number;
    invoiceNumber: string;
    expenseDate: string;
}