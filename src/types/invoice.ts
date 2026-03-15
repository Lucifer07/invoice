export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  fromCompany: string;
  fromEmail: string;
  fromPhone: string;
  fromAddress: string;
  toCompany: string;
  toEmail: string;
  toPhone: string;
  toAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'draft' | 'sent' | 'paid';
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceFormData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  fromCompany: string;
  fromEmail: string;
  fromPhone: string;
  fromAddress: string;
  toCompany: string;
  toEmail: string;
  toPhone: string;
  toAddress: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}
