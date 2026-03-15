import { Invoice, InvoiceItem } from '../types/invoice';

export const generateInvoiceNumber = (existingInvoices: Invoice[]): string => {
  const prefix = 'INV';
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  const currentYearInvoices = existingInvoices.filter(inv => {
    const invDate = new Date(inv.date);
    return invDate.getFullYear() === year && String(invDate.getMonth() + 1).padStart(2, '0') === month;
  });

  const lastNumber = currentYearInvoices.reduce((max, inv) => {
    const match = inv.invoiceNumber.match(/INV-(\d{4})(\d{2})(\d{4})/);
    if (match) {
      return Math.max(max, parseInt(match[3]));
    }
    return max;
  }, 0);

  const nextNumber = String(lastNumber + 1).padStart(4, '0');
  return `${prefix}-${year}${month}-${nextNumber}`;
};

export const calculateItemTotal = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

export const calculateTax = (subtotal: number, taxRate: number): number => {
  return (subtotal * taxRate) / 100;
};

export const calculateTotal = (subtotal: number, taxRate: number): number => {
  const taxAmount = calculateTax(subtotal, taxRate);
  return subtotal + taxAmount;
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
