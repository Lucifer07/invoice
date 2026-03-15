import { Invoice, InvoiceFormData } from '../types/invoice';

const STORAGE_KEY = 'invoices';
const DRAFT_KEY = 'draft_invoice';

export const invoiceStorage = {
  getAll: (): Invoice[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  getById: (id: string): Invoice | null => {
    try {
      const invoices = invoiceStorage.getAll();
      return invoices.find(invoice => invoice.id === id) || null;
    } catch (error) {
      console.error('Error finding invoice:', error);
      return null;
    }
  },

  save: (invoice: Invoice): void => {
    try {
      const invoices = invoiceStorage.getAll();
      const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);

      if (existingIndex >= 0) {
        invoices[existingIndex] = invoice;
      } else {
        invoices.push(invoice);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    } catch (error) {
      console.error('Error saving invoice:', error);
      throw new Error('Failed to save invoice');
    }
  },

  delete: (id: string): void => {
    try {
      const invoices = invoiceStorage.getAll();
      const filtered = invoices.filter(inv => inv.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw new Error('Failed to delete invoice');
    }
  },

  saveDraft: (data: InvoiceFormData): void => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  },

  getDraft: (): InvoiceFormData | null => {
    try {
      const data = localStorage.getItem(DRAFT_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading draft:', error);
      return null;
    }
  },

  clearDraft: (): void => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  },
};
