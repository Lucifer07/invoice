import { Invoice } from '../types/invoice';
import { formatDate, formatCurrency } from '../utils/invoice';

interface InvoicePreviewProps {
  invoice: Invoice;
  onEdit?: () => void;
  onDelete?: () => void;
  onPrint?: () => void;
}

export const InvoicePreview = ({ invoice, onEdit, onDelete, onPrint }: InvoicePreviewProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden" id="invoice-preview">
      <div className="bg-primary text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">INVOICE</h1>
            <p className="text-lg mt-2">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium">
              {invoice.status.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Dari</h3>
            <div className="space-y-1 text-gray-700">
              <p className="font-bold">{invoice.fromCompany}</p>
              <p>{invoice.fromEmail}</p>
              <p>{invoice.fromPhone}</p>
              <p className="whitespace-pre-line">{invoice.fromAddress}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Tanggal</p>
              <p className="font-semibold text-gray-800">{formatDate(invoice.date)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Jatuh Tempo</p>
              <p className="font-semibold text-gray-800">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Kepada</h3>
            <div className="space-y-1 text-gray-700">
              <p className="font-bold">{invoice.toCompany}</p>
              <p>{invoice.toEmail}</p>
              <p>{invoice.toPhone}</p>
              <p className="whitespace-pre-line">{invoice.toAddress}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Deskripsi</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Jumlah</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Harga Satuan</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-3 px-4">{item.description}</td>
                  <td className="py-3 px-4 text-center">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-3 px-4 text-right font-semibold">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-full md:w-1/2 lg:w-1/3 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Pajak ({invoice.taxRate}%)</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-primary pt-2 font-bold text-lg text-primary">
              <span>Total</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {(invoice.bankName || invoice.accountNumber || invoice.accountName) && (
          <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Informasi Pembayaran
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nama Bank</p>
                <p className="font-semibold text-gray-800">{invoice.bankName || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Nomor Rekening</p>
                <p className="font-semibold text-gray-800">{invoice.accountNumber || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Atas Nama</p>
                <p className="font-semibold text-gray-800">{invoice.accountName || '-'}</p>
              </div>
            </div>
          </div>
        )}

        {invoice.notes && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Catatan</h4>
            <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>Dibuat: {new Date(invoice.createdAt).toLocaleString('id-ID')}</p>
          <p>Diperbarui: {new Date(invoice.updatedAt).toLocaleString('id-ID')}</p>
        </div>

        {onEdit && onDelete && onPrint && (
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={onPrint}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
