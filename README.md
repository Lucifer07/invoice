# Invoice Generator

A modern, professional invoice generator web application built with React, TypeScript, and Tailwind CSS. Features include invoice creation, editing, previewing, and printing with automatic local storage caching.

## Features

- ✅ Create professional invoices with ease
- ✅ Edit and update existing invoices
- ✅ Preview invoices before printing
- ✅ Print invoices directly from the browser
- ✅ Automatic local storage caching
- ✅ Invoice history and management
- ✅ Responsive design
- ✅ Form validation
- ✅ Indonesian Rupiah (IDR) currency formatting
- ✅ Automatic tax calculations

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- LocalStorage API

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Usage

1. **Create New Invoice**: Click "Buat Invoice" in the navigation menu
2. **Fill in Details**:
   - Invoice information (number, date, due date)
   - Your company details
   - Client details
   - Invoice items with quantity and price
   - Tax rate
   - Notes
3. **Save Invoice**: Click "Simpan Invoice" to save to local storage
4. **Preview & Print**: View the invoice preview and print if needed
5. **Manage Invoices**: Use the "Riwayat" tab to view, edit, or delete saved invoices

## Local Storage

All invoice data is automatically cached in the browser's local storage. Your data persists even after closing the browser.

## Project Structure

```
src/
├── components/
│   ├── InvoiceForm.tsx       # Main invoice creation form
│   ├── InvoicePreview.tsx    # Invoice preview display
│   └── InvoiceHistory.tsx    # Invoice history list
├── services/
│   └── storage.ts            # Local storage service
├── types/
│   └── invoice.ts            # TypeScript interfaces
├── utils/
│   └── invoice.ts            # Utility functions
├── App.tsx                    # Main application component
├── main.tsx                   # Entry point
└── index.css                  # Global styles
```

## License

MIT
