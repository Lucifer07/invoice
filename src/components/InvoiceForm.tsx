import { useState, useEffect } from 'react';
import { InvoiceFormData, InvoiceItem } from '../types/invoice';
import { generateId, calculateItemTotal } from '../utils/invoice';

interface InvoiceFormProps {
  initialData?: InvoiceFormData;
  onSubmit: (data: InvoiceFormData) => void;
  onSaveDraft: (data: InvoiceFormData) => void;
  onCancel?: () => void;
}

export const InvoiceForm = ({ initialData, onSubmit, onSaveDraft, onCancel }: InvoiceFormProps) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fromCompany: '',
    fromEmail: '',
    fromPhone: '',
    fromAddress: '',
    toCompany: '',
    toEmail: '',
    toPhone: '',
    toAddress: '',
    items: [{ id: generateId(), description: '', quantity: 1, unitPrice: 0, total: 0 }],
    taxRate: 11,
    notes: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    onSaveDraft(formData);
  }, [formData, onSaveDraft]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fromCompany.trim()) {
      newErrors.fromCompany = 'Nama perusahaan wajib diisi';
    }
    if (!formData.toCompany.trim()) {
      newErrors.toCompany = 'Nama klien wajib diisi';
    }
    if (!formData.fromEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.fromEmail)) {
      newErrors.fromEmail = 'Email tidak valid';
    }
    if (!formData.toEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.toEmail)) {
      newErrors.toEmail = 'Email tidak valid';
    }

    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item-${index}-description`] = 'Deskripsi wajib diisi';
      }
      if (item.quantity <= 0) {
        newErrors[`item-${index}-quantity`] = 'Jumlah harus lebih dari 0';
      }
      if (item.unitPrice < 0) {
        newErrors[`item-${index}-unitPrice`] = 'Harga tidak boleh negatif';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof InvoiceFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items];
    const updatedItem = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'unitPrice') {
      updatedItem.total = calculateItemTotal(
        Number(updatedItem.quantity),
        Number(updatedItem.unitPrice)
      );
    }

    newItems[index] = updatedItem;
    setFormData(prev => ({ ...prev, items: newItems }));

    const errorKey = `item-${index}-${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: generateId(), description: '', quantity: 1, unitPrice: 0, total: 0 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-6">Informasi Invoice</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Invoice</label>
            <input
              type="text"
              value={formData.invoiceNumber}
              onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="INV-202401-0001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jatuh Tempo</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Dari</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan *</label>
                <input
                  type="text"
                  value={formData.fromCompany}
                  onChange={(e) => handleInputChange('fromCompany', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.fromCompany ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="PT Contoh Indonesia"
                />
                {errors.fromCompany && <p className="text-red-500 text-sm mt-1">{errors.fromCompany}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.fromEmail}
                  onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.fromEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="email@perusahaan.com"
                />
                {errors.fromEmail && <p className="text-red-500 text-sm mt-1">{errors.fromEmail}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                <input
                  type="tel"
                  value={formData.fromPhone}
                  onChange={(e) => handleInputChange('fromPhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+62 21 1234 5678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea
                  value={formData.fromAddress}
                  onChange={(e) => handleInputChange('fromAddress', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Alamat lengkap perusahaan"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Kepada</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Klien *</label>
                <input
                  type="text"
                  value={formData.toCompany}
                  onChange={(e) => handleInputChange('toCompany', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.toCompany ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="PT Klien Anda"
                />
                {errors.toCompany && <p className="text-red-500 text-sm mt-1">{errors.toCompany}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.toEmail}
                  onChange={(e) => handleInputChange('toEmail', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.toEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="email@klien.com"
                />
                {errors.toEmail && <p className="text-red-500 text-sm mt-1">{errors.toEmail}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                <input
                  type="tel"
                  value={formData.toPhone}
                  onChange={(e) => handleInputChange('toPhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+62 21 8765 4321"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea
                  value={formData.toAddress}
                  onChange={(e) => handleInputChange('toAddress', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Alamat lengkap klien"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-6">Detail Item</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 w-1/2">Deskripsi</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Jumlah</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Harga Satuan</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 w-20">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className={`w-full px-3 py-2 border ${errors[`item-${index}-description`] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                      placeholder="Nama produk/jasa"
                    />
                    {errors[`item-${index}-description`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`item-${index}-description`]}</p>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                      className={`w-20 px-3 py-2 border ${errors[`item-${index}-quantity`] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center`}
                    />
                    {errors[`item-${index}-quantity`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`item-${index}-quantity`]}</p>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                      className={`w-32 px-3 py-2 border ${errors[`item-${index}-unitPrice`] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right`}
                      placeholder="0"
                    />
                    {errors[`item-${index}-unitPrice`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`item-${index}-unitPrice`]}</p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-800">
                    Rp {item.total.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Hapus
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-4 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
        >
          + Tambah Item
        </button>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pajak (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.taxRate}
              onChange={(e) => handleInputChange('taxRate', Number(e.target.value))}
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Catatan tambahan untuk klien"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-6">Informasi Pembayaran</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Contoh: BCA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening</label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Contoh: 1234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Atas Nama</label>
            <input
              type="text"
              value={formData.accountName}
              onChange={(e) => handleInputChange('accountName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Nama pemilik rekening"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary font-medium shadow-md"
        >
          Simpan Invoice
        </button>
      </div>
    </form>
  );
};
