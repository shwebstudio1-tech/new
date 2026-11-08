import React from 'react';
import { Printer, Download, X, FileText, CheckCircle2 } from 'lucide-react';
import { Invoice } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PrintableInvoiceProps {
  invoice: Invoice | null;
  onClose?: () => void;
  storeAddress: string;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ invoice, onClose, storeAddress }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsPdf = async () => {
    const element = document.getElementById('printable-invoice-content');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-6 print:!block print:!static print:!bg-white print:!overflow-visible">
      {/* Action Header Bar (Screen Only) */}
      <div className="w-full max-w-[420px] mb-4 bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700/80 flex items-center justify-between gap-2 print:hidden animate-in fade-in slide-in-from-top-4 duration-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide">Invoice Preview</h3>
            <p className="text-[10px] font-mono text-teal-400">{invoice.invoiceNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
            title="Print this invoice directly"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {/* Save as PDF Button */}
          <button
            type="button"
            onClick={handleSaveAsPdf}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
            title="Save invoice as PDF file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save as PDF</span>
          </button>

          {/* Close Button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div id="printable-invoice-content" style={{ backgroundColor: '#ffffff', color: '#000000', width: '100%', maxWidth: '340px', padding: '24px', border: '1px solid #d1d5db', fontFamily: 'monospace', fontSize: '12px', userSelect: 'none' }}>
        {/* Pharmacy Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px dashed #9ca3af', paddingBottom: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#064e3b', color: '#ffffff', fontFamily: 'sans-serif', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', marginBottom: '4px' }}>
            Official Cash Receipt
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', margin: 0, color: '#000000' }}>TALHA SURGICAL</h1>
          <p style={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'sans-serif', margin: 0, color: '#374151' }}>& MEDICINE SHOP</p>
          <p style={{ fontSize: '10px', margin: 0, color: '#4b5563' }}>{storeAddress}</p>
          <p style={{ fontSize: '9px', margin: 0, color: '#6b7280' }}>Tel: 0300-1234567 • License: DRAP-PK-99</p>
        </div>

        {/* Invoice Meta */}
        <div style={{ marginBottom: '12px', fontSize: '11px', borderBottom: '1px dashed #d1d5db', paddingBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#4b5563' }}>INVOICE NO:</span>
            <span style={{ fontWeight: 'bold', color: '#000000', fontFamily: 'monospace' }}>{invoice.invoiceNumber}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#4b5563' }}>DATE & TIME:</span>
            <span style={{ color: '#000000' }}>{invoice.date} {invoice.time}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#4b5563' }}>CUSTOMER:</span>
            <span style={{ fontWeight: 'bold', color: '#000000' }}>{invoice.customerName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#4b5563' }}>DISPENSER:</span>
            <span style={{ color: '#000000' }}>{invoice.cashier}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#4b5563' }}>PAYMENT:</span>
            <span style={{ fontWeight: 'bold', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', color: '#000000' }}>{invoice.paymentMethod}</span>
          </div>
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', borderBottom: '2px solid #000000', paddingBottom: '4px', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}>
            <span style={{ gridColumn: 'span 3' }}>ITEM DESCRIPTION</span>
            <span style={{ textAlign: 'center' }}>QTY</span>
            <span style={{ textAlign: 'right', gridColumn: 'span 2' }}>AMOUNT</span>
          </div>
          <div style={{ fontSize: '11px' }}>
            {invoice.items.map((item, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', borderBottom: '1px solid #f3f4f6', paddingBottom: '4px' }}>
                <span style={{ gridColumn: 'span 3', fontWeight: 600, color: '#1f2937' }}>{item.name}</span>
                <span style={{ textAlign: 'center', fontFamily: 'monospace' }}>{item.qty}</span>
                <span style={{ textAlign: 'right', gridColumn: 'span 2', fontFamily: 'monospace' }}>{(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Section */}
        <div style={{ borderTop: '2px dashed #9ca3af', paddingTop: '8px', marginBottom: '16px', fontSize: '11px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', fontWeight: 900, borderTop: '2px solid #000000', borderBottom: '2px solid #000000', padding: '6px 0', margin: '4px 0' }}>
            <span>NET TOTAL (PKR):</span>
            <span style={{ fontFamily: 'monospace' }}>Rs.{invoice.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Barcode Graphic */}
        <div style={{ textAlign: 'center', padding: '8px 0', borderTop: '1px dashed #d1d5db' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2px', height: '36px', marginBottom: '4px' }}>
            {[4,2,3,1,4,2,1,3,2,4,1,2,3,4,1,3,2,1,4,2,3,1,2,4,2,1,3,4,1,2,3,2,4,1].map((w, i) => (
              <div
                key={i}
                style={{ backgroundColor: '#0f172a', height: '100%', width: `${w}px` }}
              />
            ))}
          </div>
          <p style={{ fontSize: '9px', fontFamily: 'monospace', color: '#6b7280', letterSpacing: '0.1em' }}>{invoice.invoiceNumber}</p>
        </div>

        {/* Footer Notes */}
        <div style={{ textAlign: 'center', borderTop: '1px dashed #d1d5db', paddingTop: '12px', fontSize: '9px', color: '#6b7280' }}>
          <p style={{ fontWeight: 'bold', color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            Thank you for your visit!
          </p>
          <p>Please inspect medicines before leaving counter.</p>
          <p>Returns accepted within 3 days with original receipt.</p>
          <p>Cold chain items & opened packs cannot be returned.</p>
          <p style={{ paddingTop: '8px', fontSize: '8px', color: '#9ca3af' }}>Software: Talha Surgical & Medicine Shop ERP</p>
        </div>
      </div>
    </div>
  );
};
