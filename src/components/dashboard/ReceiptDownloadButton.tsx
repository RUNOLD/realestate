"use client";

import * as React from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Payment {
  id: string;
  amount: number;
  reference: string;
  status: string;
  method: string;
  createdAt: Date;
}

interface ReceiptProps {
  payment: Payment;
  userName: string;
  remarks?: string;
}

export function ReceiptDownloadButton({ 
  payment, 
  userName, 
  remarks = "Professional services rendered." 
}: ReceiptProps) {
  
  const handlePrint = () => {
    // Ensuring the browser has focus on the window before printing
    window.print();
  };

  return (
    <>
      {/* Global Print Styles Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media screen {
          .receipt-print-only { display: none; }
        }
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body * { visibility: hidden; }
          .receipt-print-only, .receipt-print-only * { visibility: visible; }
          .receipt-print-only {
            display: flex !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            min-height: 100%;
            background: #08080A !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
        }
      `}} />

      <Button
        onClick={handlePrint}
        variant="outline"
        size="sm"
        className="h-9 gap-2 font-semibold hover:bg-primary hover:text-primary-foreground no-print transition-all"
      >
        <Download size={16} />
        <span>Download Receipt</span>
      </Button>

      {/* DEBUGGED: Changed 'hidden' to 'receipt-print-only'. 
        The 'hidden' class in Tailwind uses !important, which overrides 'print:flex'.
      */}
      <div className="receipt-print-only flex-col w-full bg-[#08080A] text-white p-[20mm] antialiased">
        
        {/* TOP BRANDING & LOGO */}
        <div className="flex justify-between items-end border-b-2 border-[#C5A05B] pb-10 mb-12">
          <div className="flex items-center gap-6">
            {/* Note: Ensure /logo.png exists in your public folder */}
            <img src="/logo.png" alt="Ayoola " className="h-16 w-auto object-contain brightness-200" />
            <div className="border-l border-white/20 pl-6">
              <h1 className="text-3xl font-black tracking-[0.1em] uppercase leading-none">Ayoola</h1>
              <p className="text-[10px] font-bold tracking-[0.3em] text-[#C5A05B] uppercase mt-2">
                Managing Value, Building Trust
              </p>
            </div>
          </div>
          <div className="text-right">
            {/* Watermark RECEIPT */}
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white/5 absolute right-20 top-16 select-none">
              RECEIPT
            </h2>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Receipt Number</p>
              <p className="text-lg font-black tracking-widest">#{payment.id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* CLIENT & PAYMENT METADATA */}
        <div className="grid grid-cols-3 gap-12 mb-16 px-2">
          <div className="space-y-3">
            <h3 className="text-[#C5A05B] text-[10px] font-black uppercase tracking-[0.2em]">Client Details</h3>
            <div className="space-y-1">
              <p className="text-sm font-bold tracking-tight">{userName.toUpperCase()}</p>
              <p className="text-[10px] text-white/50 uppercase font-medium">Verified Property Tenant</p>
            </div>
          </div>
          
          <div className="space-y-3 border-l border-white/10 pl-10">
            <h3 className="text-[#C5A05B] text-[10px] font-black uppercase tracking-[0.2em]">Payment Date</h3>
            <p className="text-sm font-bold uppercase">
              {new Date(payment.createdAt).toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>

          <div className="space-y-3 border-l border-white/10 pl-10">
            <h3 className="text-[#C5A05B] text-[10px] font-black uppercase tracking-[0.2em]">Method</h3>
            <p className="text-sm font-bold uppercase tracking-tight">{payment.method || 'Bank Transfer'}</p>
          </div>
        </div>

        {/* TRANSACTION LINE ITEM */}
        <div className="flex-grow">
          <div className="w-full border border-white/10 rounded-sm overflow-hidden mb-12">
            <div className="bg-white/[0.03] px-8 py-4 border-b border-white/10 flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A05B]">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <div className="px-8 py-10 flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-lg font-bold tracking-tight">Property Management Services</p>
                <p className="text-[10px] text-white/40 font-mono tracking-tighter uppercase">
                  REF: {payment.reference.toUpperCase()}
                </p>
              </div>
              <p className="text-2xl font-black tracking-tighter">₦{payment.amount.toLocaleString()}</p>
            </div>
          </div>

          {/* REMARKS SECTION */}
          {remarks && (
            <div className="px-2 mb-12 space-y-3">
              <h3 className="text-[#C5A05B] text-[10px] font-black uppercase tracking-[0.2em]">Management Remarks</h3>
              <p className="text-[11px] text-white/50 leading-relaxed max-w-xl italic border-l-2 border-[#C5A05B]/30 pl-4">
                {remarks}
              </p>
            </div>
          )}
        </div>

        {/* TOTAL & FOOTER SIGNATURE */}
        <div className="mt-auto border-t border-white/10 pt-12 flex justify-between items-end">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em]">
              <CheckCircle2 size={14} className="animate-pulse" />
              Payment Successfully Processed
            </div>
            <div className="space-y-1">
              <div className="w-40 h-[1px] bg-white/20 mb-2"></div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Authorized Signature</p>
            </div>
          </div>

          <div className="bg-[#C5A05B] text-black px-10 py-8 rounded-sm shadow-2xl text-right min-w-[280px]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Total Amount Paid</p>
            <p className="text-4xl font-black tracking-tighter leading-none">₦{payment.amount.toLocaleString()}</p>
          </div>
        </div>

        {/* COMPANY FOOTER */}
        <div className="mt-12 text-center">
          <p className="text-[8px] text-white/20 uppercase tracking-[0.5em] font-medium">
            Ayoola Property Management & Sourcing LTD | RC-1782934 | TIN-21110098
          </p>
        </div>
      </div>
    </>
  );
}