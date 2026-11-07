import React from 'react';
import { Invoice } from '../types';

interface PrintableInvoiceProps {
  invoice: Invoice | null;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ invoice }) => {
  if (!invoice) return null;

  return (
    <div className="hidden print:block print:fixed print:inset-0 print:bg-white print:z-[9999] print:p-8 font-mono text-black text-sm w-[80mm] mx-auto bg-white p-4">
      <div className="text-center space-y-1 mb-4 border-b border-dashed border-gray-400 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-tighter">TALHA SURGICAL</h1>
        <p className="text-xs font-bold font-sans tracking-tight">& MEDICINE SHOP</p>
        <p className="text-[10px]">Opposite DHQ Hospital, Punjab</p>
        <p className="text-[10px]">Tel: 0300-1234567 • License: DRAP-PK-99</p>
      </div>

      <div className="space-y-1 mb-4 text-[11px] border-b border-dashed border-gray-400 pb-2">
        <div className="flex justify-between">
          <span>INV NO:</span>
          <span className="font-bold">{invoice.invoiceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>DATE:</span>
          <span>{invoice.date} {invoice.time}</span>
        </div>
        <div className="flex justify-between">
          <span>CUSTOMER:</span>
          <span className="font-bold">{invoice.customerName}</span>
        </div>
        <div className="flex justify-between">
          <span>CASHIER:</span>
          <span>{invoice.cashier}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-6 gap-1 border-b border-black pb-1 mb-1 text-[10px] font-bold">
          <span className="col-span-3">DESCRIPTION</span>
          <span className="text-center">QTY</span>
          <span className="text-right col-span-2">PRICE</span>
        </div>
        <div className="space-y-1 text-[10px]">
          {invoice.items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-6 gap-1">
              <span className="col-span-3 leading-tight font-bold">{item.name}</span>
              <span className="text-center">{item.qty}</span>
              <span className="text-right col-span-2">{(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1 border-t border-dashed border-gray-400 pt-3 mb-6">
        <div className="flex justify-between font-bold text-base border-t-2 border-black pt-2">
          <span>TOTAL (Rs.)</span>
          <span className="text-lg">{invoice.totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span>METHOD:</span>
          <span className="font-bold">{invoice.paymentMethod}</span>
        </div>
        {invoice.amountTendered && (
          <>
            <div className="flex justify-between text-[11px]">
              <span>CASH RECEIVED:</span>
              <span>{invoice.amountTendered.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold">
              <span>CHANGE RETURNED:</span>
              <span>{invoice.changeReturned?.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      <div className="text-center space-y-1 border-t border-dashed border-gray-400 pt-4 text-[9px]">
        <p className="font-bold">THANK YOU FOR YOUR VISIT</p>
        <p>Return within 3 days with original bill.</p>
        <p>No return for Cold Chain items / Masks.</p>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p>Software by Talha Surgical IT</p>
        </div>
      </div>
    </div>
  );
};
