import React from 'react';
import { Printer, Download, X, FileText, CheckCircle2 } from 'lucide-react';
import { Invoice } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PrintableInvoiceProps {
  invoice: Invoice | null;
  onClose?: () => void;
  storeAddress: string;
  setToast?: (toast: { type: 'success' | 'error' | 'info'; message: string } | null) => void;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ invoice, onClose, storeAddress, setToast }) => {
  const [isPrintingFeedback, setIsPrintingFeedback] = React.useState(false);

  const storeName = localStorage.getItem('talha_store_name') || 'TALHA SURGICAL & MEDICINE SHOP';
  const storePhone = localStorage.getItem('talha_store_phone') || '0300-1234567';
  const storeLicense = localStorage.getItem('talha_store_license') || 'DRAP-PK-99';
  const storeLogo = localStorage.getItem('talha_store_logo');

  React.useEffect(() => {
    if (invoice) {
      // 1.5s delay allows the user to see the preview clearly before the print dialog opens
      const timer = setTimeout(() => {
        requestAnimationFrame(() => {
          handlePrint();
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [invoice?.id]);

  const handlePrint = () => {
    if (isPrintingFeedback) return;
    setIsPrintingFeedback(true);
    
    if (setToast) {
      setToast({ 
        type: 'info', 
        message: 'Printing command sent! Agar print na hu tu check krain printer system say connect hai ya nahi.' 
      });
    }

    // Ensure the content is focused and ready for printing
    setTimeout(() => {
      window.focus();
      window.print();
      
      // Reset feedback after a delay to allow re-printing if needed
      setTimeout(() => {
        setIsPrintingFeedback(false);
      }, 3000);
    }, 50);
  };

  const handleSaveAsPdf = async () => {
    if (!invoice) return;
    const element = document.getElementById('printable-invoice-content');
    if (!element) return;

    // Use a clone or ensure the element is fully rendered for capture
    const canvas = await html2canvas(element, {
      scale: 3, // Higher scale for better text crispness
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Fix for stylesheets containing 'oklch'
        const styleTags = clonedDoc.querySelectorAll('style');
        styleTags.forEach(tag => {
          tag.innerHTML = tag.innerHTML.replace(/oklch\([^)]+\)/g, 'black');
        });

        // Fix for inline styles
        const originalElements = document.querySelectorAll('*');
        const clonedElements = clonedDoc.querySelectorAll('*');
        
        for (let i = 0; i < Math.min(originalElements.length, clonedElements.length); i++) {
          const original = originalElements[i] as HTMLElement;
          const cloned = clonedElements[i] as HTMLElement;
          
          const computedStyle = window.getComputedStyle(original);
          const colorProps = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'fill', 'stroke'];
          
          colorProps.forEach(prop => {
            const val = computedStyle.getPropertyValue(prop);
            if (val && val.includes('oklch')) {
              // Force fallback
              cloned.style.setProperty(prop, prop === 'backgroundColor' ? 'transparent' : 'black');
            } else {
              cloned.style.setProperty(prop, val);
            }
          });
        }
      }
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Calculate dimensions in mm (1px ~ 0.264583mm)
    const imgWidth = 80; // Standard thermal width approx 80mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF with dynamic height to prevent clipping
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [imgWidth, imgHeight + 10], // Add 10mm buffer at bottom
      compress: true
    });

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    pdf.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  };

  if (!invoice) return null;

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
            disabled={isPrintingFeedback}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 ${
              isPrintingFeedback 
                ? 'bg-slate-700 text-teal-400 cursor-not-allowed opacity-80' 
                : 'bg-teal-600 hover:bg-teal-500 text-white'
            }`}
            title="Print this invoice directly"
          >
            {isPrintingFeedback ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 animate-pulse" />
                <span>Printing...</span>
              </>
            ) : (
              <>
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </>
            )}
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

      <div 
        id="printable-invoice-content" 
        style={{ 
          backgroundColor: '#ffffff', 
          color: '#0f172a', 
          width: '100%', 
          maxWidth: '350px', 
          padding: '24px', 
          border: '1px solid #cbd5e1', 
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          fontFamily: 'system-ui, -apple-system, sans-serif', 
          fontSize: '12px', 
          lineHeight: '1.5',
          boxSizing: 'border-box',
          userSelect: 'none' 
        }}
      >
        {/* Pharmacy Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px', color: '#065f46' }}>✚</div>
          <h1 style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 4px 0', color: '#0f172a', letterSpacing: '-0.02em' }}>
            TALHA SURGICAL
          </h1>
          <h2 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#334155' }}>
            & MEDICINE SHOP
          </h2>
          <p style={{ fontSize: '11px', margin: '4px 0', color: '#475569', fontWeight: 500 }}>
            Location: {localStorage.getItem('talha_store_address') || 'Bakhshal'}
          </p>
          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
            <span>Phone: {storePhone}</span> | <span>License: {storeLicense}</span>
            <br />
            <span>NTN: 0000000-0</span> | <span>STRN: 00-00-0000-000-00</span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px', fontSize: '11px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '12px 0' }}>
          <div style={{ color: '#64748b', fontWeight: 600 }}>INVOICE NO:</div>
          <div style={{ fontWeight: 800, color: '#0f172a', textAlign: 'right' }}>{invoice.invoiceNumber}</div>
          
          <div style={{ color: '#64748b', fontWeight: 600 }}>DATE & TIME:</div>
          <div style={{ color: '#0f172a', fontWeight: 600, textAlign: 'right' }}>{invoice.date} {invoice.time}</div>
          
          <div style={{ color: '#64748b', fontWeight: 600 }}>CUSTOMER:</div>
          <div style={{ fontWeight: 700, color: '#0f172a', textAlign: 'right' }}>{invoice.customerName}</div>
          
          <div style={{ color: '#64748b', fontWeight: 600 }}>DISPENSER:</div>
          <div style={{ color: '#0f172a', fontWeight: 600, textAlign: 'right' }}>{invoice.cashier}</div>
          
          <div style={{ color: '#64748b', fontWeight: 600 }}>PAYMENT:</div>
          <div style={{ fontWeight: 700, color: '#0f172a', textAlign: 'right' }}>{invoice.paymentMethod}</div>
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            backgroundColor: '#f1f5f9', 
            padding: '8px', 
            fontSize: '10px', 
            fontWeight: 800, 
            color: '#475569', 
            textTransform: 'uppercase'
          }}>
            <span style={{ width: '60%' }}>Item Description</span>
            <span style={{ width: '10%', textAlign: 'center' }}>Qty</span>
            <span style={{ width: '30%', textAlign: 'right' }}>Amount</span>
          </div>
          <div>
            {invoice.items.map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '10px 8px',
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                <div style={{ width: '60%', fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                <div style={{ width: '10%', textAlign: 'center', fontWeight: 700 }}>{item.qty}</div>
                <div style={{ width: '30%', textAlign: 'right', fontWeight: 700 }}>{(item.price * item.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Section */}
        <div style={{ marginBottom: '24px', padding: '0 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 900, color: '#0f172a', marginBottom: '12px' }}>
            <span>TOTAL PRICE (PKR):</span>
            <span>Rs.{invoice.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#475569', paddingTop: '16px', borderTop: '2px solid #0f172a', paddingBottom: '20px' }}>
          <p style={{ fontWeight: 800, color: '#065f46', margin: '0 0 8px 0' }}>
            Thank you for trusting us with your health! - Get well soon.
          </p>
          <p style={{ margin: 0, fontSize: '9px', color: '#94a3b8' }}>Talha Surgical & Medicine Shop ERP</p>
        </div>
      </div>
    </div>
  );
};
