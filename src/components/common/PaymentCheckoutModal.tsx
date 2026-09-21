import React, { useState } from 'react';
import { CreditCard, QrCode, ShieldCheck, CheckCircle, Sparkles, Smartphone, ArrowRight, X, Download, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (plan: string, txnId: string) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'priority'>('priority');
  const [paymentMethod, setPaymentMethod] = useState<'upi_qr' | 'upi_id'>('upi_qr');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [txnDetails, setTxnDetails] = useState<{ id: string; amount: number; date: string } | null>(null);

  if (!isOpen) return null;

  const planAmounts = {
    standard: 49,
    priority: 99
  };

  const amount = planAmounts[selectedPlan];

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedTxn = {
        id: `SW-PAY-${Date.now().toString().slice(-8)}`,
        amount,
        date: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setTxnDetails(generatedTxn);
      setIsProcessing(false);
      setPaymentSuccess(true);
      try {
        localStorage.setItem('schemewise_pro_paid', 'true');
        localStorage.setItem('schemewise_pro_plan', selectedPlan);
      } catch {
        // ignore in sandboxed iframes
      }
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onPaymentSuccess) {
        onPaymentSuccess(selectedPlan, generatedTxn.id);
      }
    }, 1500);
  };

  const handleDownloadReceipt = () => {
    if (!txnDetails) return;
    const content = `====================================================================\n` +
      `TAX INVOICE & PAYMENT RECEIPT\n` +
      `SchemeWise — Autonomous Scheme-Bundle Optimizer (PS16)\n` +
      `National e-Governance Assistance Service\n` +
      `====================================================================\n\n` +
      `Transaction ID    : ${txnDetails.id}\n` +
      `Date & Time       : ${txnDetails.date}\n` +
      `Service Purchased : Fast-Track Assisted Filing Pass (${selectedPlan.toUpperCase()})\n` +
      `Amount Paid       : INR ${txnDetails.amount}.00 (Inclusive of GST)\n` +
      `Payment Mode      : UPI / NetBanking / Direct Nodal Settlement\n` +
      `Payment Status    : SUCCESS / CONFIRMED\n\n` +
      `BENEFITS UNLOCKED:\n` +
      `- Dedicated Application Desk Assistance & Document Pre-scrutiny\n` +
      `- Automated SMS & WhatsApp Calendar Filing Alerts\n` +
      `- Tahsildar / MahaDBT Nodal Officer Follow-up Verification Tracking\n` +
      `- Priority Appeal Assistance for Unjust Objections\n\n` +
      `====================================================================\n` +
      `Thank you for trusting SchemeWise. This is an electronically generated receipt.\n` +
      `Support: helpdesk@schemewise.gov.in\n` +
      `====================================================================\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SchemeWise_Receipt_${txnDetails.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-800/80 text-blue-200">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                SchemeWise Fast-Track Filing Pass
              </h3>
              <p className="text-xs text-blue-200">
                End-to-End Application Assistance & Deadline Guarantee
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess && txnDetails ? (
          /* Success Screen */
          <div className="p-6 text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">
                Payment Successful!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Your Fast-Track Filing Pass has been activated for all schemes in your roadmap.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Transaction ID:</span>
                <span className="font-mono font-semibold text-slate-800">{txnDetails.id}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Amount Paid:</span>
                <span className="font-semibold text-emerald-700">₹{txnDetails.amount} (All inclusive)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Plan:</span>
                <span className="font-semibold text-blue-700 capitalize">{selectedPlan} Assistance</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Timestamp:</span>
                <span className="text-slate-800">{txnDetails.date}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 text-left flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Services Activated:</strong> SMS & WhatsApp deadline alerts enabled, college scrutiny desk checklist unlocked, and priority helpline support ready.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="flex-1 py-2.5 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Invoice</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Continue to Roadmap
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
            {/* Plan Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Your Advisory Plan
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPlan('standard')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedPlan === 'standard'
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">Essential</span>
                    <span className="font-bold text-blue-700 text-sm">₹49</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Roadmap PDF + SMS reminder for deadlines
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlan('priority')}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    selectedPlan === 'priority'
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="absolute -top-2 right-2 px-1.5 py-0.5 bg-indigo-600 text-white text-[9px] font-bold rounded-full">
                    POPULAR
                  </span>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">Priority Pro</span>
                    <span className="font-bold text-indigo-700 text-sm">₹99</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    WhatsApp alerts + Document verification desk
                  </p>
                </button>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Payment Method (Fast UPI)
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_qr')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    paymentMethod === 'upi_qr'
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-4 h-4" /> Scan UPI QR
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_id')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    paymentMethod === 'upi_id'
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4" /> Enter UPI ID
                </button>
              </div>

              {paymentMethod === 'upi_qr' ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center space-y-3">
                  {/* Generated clean SVG QR code visual */}
                  <div className="w-36 h-36 bg-white p-2 border border-slate-200 rounded-xl shadow-sm flex items-center justify-center">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full text-slate-900 fill-current"
                    >
                      <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z" />
                      <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z" />
                      <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z" />
                      <rect x="45" y="15" width="8" height="8" />
                      <rect x="45" y="30" width="8" height="8" />
                      <rect x="45" y="45" width="8" height="8" />
                      <rect x="60" y="45" width="8" height="8" />
                      <rect x="75" y="45" width="8" height="8" />
                      <rect x="15" y="45" width="8" height="8" />
                      <rect x="30" y="45" width="8" height="8" />
                      <rect x="60" y="60" width="10" height="10" />
                      <rect x="75" y="60" width="15" height="15" />
                      <rect x="60" y="75" width="10" height="15" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      Scan with any UPI App
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      GPay, PhonePe, Paytm, BHIM, CRED
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. yourname@oksbi / 9876543210@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    A collect request will be triggered on your UPI application.
                  </p>
                </div>
              )}
            </div>

            {/* Total Price breakdown & Pay button */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Total Payable:</span>
                <span className="text-base font-extrabold text-slate-900">₹{amount}</span>
              </div>

              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Verifying Payment Gateway...
                  </span>
                ) : (
                  <>
                    Pay ₹{amount} & Activate Fast-Track Pass
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Encrypted & Safe Payments  |  Instant GST Receipt</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
