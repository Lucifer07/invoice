import { useState, useEffect, useCallback } from 'react';
import { Invoice, InvoiceFormData } from './types/invoice';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceHistory } from './components/InvoiceHistory';
import { invoiceStorage } from './services/storage';
import {
  generateInvoiceNumber,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  generateId,
} from './utils/invoice';

type View = 'form' | 'preview' | 'history';

function App() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [view, setView] = useState<View>('form');

  useEffect(() => {
    const loadedInvoices = invoiceStorage.getAll();
    setInvoices(loadedInvoices);
  }, []);

  const handleFormSubmit = (formData: InvoiceFormData) => {
    const subtotal = calculateSubtotal(formData.items);
    const taxAmount = calculateTax(subtotal, formData.taxRate);
    const total = calculateTotal(subtotal, formData.taxRate);

    const invoice: Invoice = {
      id: editingInvoice?.id || generateId(),
      invoiceNumber: formData.invoiceNumber || generateInvoiceNumber(invoices),
      date: formData.date,
      dueDate: formData.dueDate,
      fromCompany: formData.fromCompany,
      fromEmail: formData.fromEmail,
      fromPhone: formData.fromPhone,
      fromAddress: formData.fromAddress,
      toCompany: formData.toCompany,
      toEmail: formData.toEmail,
      toPhone: formData.toPhone,
      toAddress: formData.toAddress,
      items: formData.items,
      subtotal,
      taxRate: formData.taxRate,
      taxAmount,
      total,
      notes: formData.notes,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      accountName: formData.accountName,
      status: 'draft',
      createdAt: editingInvoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    invoiceStorage.save(invoice);
    setInvoices([...invoices.filter(inv => inv.id !== invoice.id), invoice]);
    setCurrentInvoice(invoice);
    setEditingInvoice(null);
    setView('preview');
    invoiceStorage.clearDraft();
  };

  const handleEdit = () => {
    if (currentInvoice) {
      setEditingInvoice(currentInvoice);
      setCurrentInvoice(null);
      setView('form');
    }
  };

  const handleDelete = () => {
    if (currentInvoice) {
      invoiceStorage.delete(currentInvoice.id);
      setInvoices(invoices.filter(inv => inv.id !== currentInvoice.id));
      setCurrentInvoice(null);
      setView('history');
    }
  };

  const handleSaveDraft = useCallback(() => {
  }, []);

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-preview');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${currentInvoice?.invoiceNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .bg-primary { background-color: #27106D; color: white; padding: 24px; }
                .text-3xl { font-size: 30px; font-weight: bold; }
                .text-lg { font-size: 18px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e5e7eb; }
                th { background-color: #f9fafb; font-weight: 600; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .font-bold { font-weight: bold; }
                .border-t-2 { border-top: 2px solid #27106D; }
                .bg-primary\\/5 { background-color: #f5f3ff; }
                .border-primary\\/20 { border: 1px solid #6b46ff33; }
                .grid { display: grid; }
                .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                .gap-4 { gap: 16px; }
              </style>
            </head>
            <body>${printContent.innerHTML}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleSelectInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setView('preview');
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setCurrentInvoice(null);
    setView('form');
  };

  const handleDeleteInvoice = (id: string) => {
    invoiceStorage.delete(id);
    setInvoices(invoices.filter(inv => inv.id !== id));
    if (currentInvoice?.id === id) {
      setCurrentInvoice(null);
      setView('history');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <nav className="bg-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-white text-xl font-bold">Invoice Generator</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setView('form')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'form'
                    ? 'bg-white text-primary'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Buat Invoice
              </button>
              <button
                onClick={() => setView('history')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'history'
                    ? 'bg-white text-primary'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Riwayat
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'form' && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {editingInvoice ? 'Edit Invoice' : 'Buat Invoice Baru'}
              </h1>
              <p className="text-gray-600 mt-2">
                {editingInvoice ? 'Perbarui detail invoice yang sudah ada' : 'Buat invoice profesional dalam hitungan detik'}
              </p>
            </div>
            <InvoiceForm
              initialData={editingInvoice ? {
                invoiceNumber: editingInvoice.invoiceNumber,
                date: editingInvoice.date,
                dueDate: editingInvoice.dueDate,
                fromCompany: editingInvoice.fromCompany,
                fromEmail: editingInvoice.fromEmail,
                fromPhone: editingInvoice.fromPhone,
                fromAddress: editingInvoice.fromAddress,
                toCompany: editingInvoice.toCompany,
                toEmail: editingInvoice.toEmail,
                toPhone: editingInvoice.toPhone,
                toAddress: editingInvoice.toAddress,
                items: editingInvoice.items,
                taxRate: editingInvoice.taxRate,
                notes: editingInvoice.notes,
                bankName: editingInvoice.bankName,
                accountNumber: editingInvoice.accountNumber,
                accountName: editingInvoice.accountName,
              } : undefined}
              onSubmit={handleFormSubmit}
              onSaveDraft={handleSaveDraft}
              onCancel={() => {
                setEditingInvoice(null);
                setView('history');
              }}
            />
          </div>
        )}

        {view === 'preview' && currentInvoice && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Preview Invoice</h1>
                <p className="text-gray-600 mt-2">Periksa invoice Anda sebelum mengirim atau mencetak</p>
              </div>
              <button
                onClick={() => setView('form')}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary font-medium"
              >
                Buat Invoice Baru
              </button>
            </div>
            <InvoicePreview
              invoice={currentInvoice}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPrint={handlePrint}
            />
          </div>
        )}

        {view === 'history' && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Riwayat Invoice</h1>
              <p className="text-gray-600 mt-2">Kelola semua invoice yang telah Anda buat</p>
            </div>
            <InvoiceHistory
              invoices={invoices}
              onSelectInvoice={handleSelectInvoice}
              onEditInvoice={handleEditInvoice}
              onDeleteInvoice={handleDeleteInvoice}
            />
          </div>
        )}
      </main>

      <footer className="bg-primary text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/80">
            © 2024 Invoice Generator. Dibuat dengan React & TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
