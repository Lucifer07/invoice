import { useState, useEffect, useCallback } from 'react';
import html2pdf from 'html2pdf.js';
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
      const element = printContent.cloneNode(true) as HTMLElement;

      const actionButtons = element.querySelectorAll('.no-print');
      actionButtons.forEach(button => button.remove());

      const opt = {
        margin: 10,
        filename: `${currentInvoice?.invoiceNumber}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      html2pdf().set(opt).from(element).save();
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
          <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-4 sm:py-0 gap-4 sm:gap-0">
            <div className="flex items-center w-full sm:w-auto">
              <svg className="w-8 h-8 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-white text-lg sm:text-xl font-bold">Invoice Generator</span>
            </div>
            <div className="flex w-full sm:w-auto justify-center sm:justify-end space-x-2 sm:space-x-4">
              <button
                onClick={() => setView('form')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  view === 'form'
                    ? 'bg-white text-primary'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Buat Invoice
              </button>
              <button
                onClick={() => setView('history')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {view === 'form' && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {editingInvoice ? 'Edit Invoice' : 'Buat Invoice Baru'}
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
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
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Preview Invoice</h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">Periksa invoice Anda sebelum mengirim atau mencetak</p>
              </div>
              <button
                onClick={() => setView('form')}
                className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary font-medium"
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
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Riwayat Invoice</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Kelola semua invoice yang telah Anda buat</p>
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

      <footer className="bg-primary text-white py-6 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/80 text-sm sm:text-base">
            © 2024 Invoice Generator. Dibuat dengan React & TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
