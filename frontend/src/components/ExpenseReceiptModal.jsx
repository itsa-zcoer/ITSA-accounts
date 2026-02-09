import { useRef } from 'react';
import { FiX, FiDownload, FiPrinter } from 'react-icons/fi';
import html2pdf from 'html2pdf.js';

const ExpenseReceiptModal = ({ isOpen, onClose, expense }) => {
    const receiptRef = useRef(null);

    if (!isOpen || !expense) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    // Generate HTML content for PDF
    const getPDFContent = () => {
        return `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; width: 100%; max-width: 400px; margin: 0 auto;">
                <!-- Header Banner -->
                <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 32px 24px; text-align: center; border-radius: 12px 12px 0 0;">
                    <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 28px; color: white; font-weight: bold;">₹</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">ITSA Accounts</h1>
                    <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 13px;">Official Expense Receipt</p>
                    <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 10px 24px; border-radius: 25px; margin-top: 16px;">
                        <span style="color: white; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">${expense.receiptNumber || 'N/A'}</span>
                    </div>
                </div>
                
                <!-- Body -->
                <div style="background: #ffffff; border: 1px solid #e5e7eb; border-top: none;">
                    
                    <!-- Expense Details Header -->
                    <div style="padding: 24px; border-bottom: 1px solid #f0f0f0;">
                        <table width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                                <td style="padding-bottom: 16px;">
                                    <p style="margin: 0; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Description</p>
                                    <p style="margin: 6px 0 0 0; font-size: 16px; color: #1f2937; font-weight: 600;">${expense.description}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="100%" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td width="50%">
                                                <p style="margin: 0; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Category</p>
                                                <p style="margin: 6px 0 0 0; font-size: 14px; color: #374151; font-weight: 500; text-transform: capitalize;">${expense.category || 'Other'}</p>
                                            </td>
                                            <td width="50%">
                                                <p style="margin: 0; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Date & Time</p>
                                                <p style="margin: 6px 0 0 0; font-size: 14px; color: #374151; font-weight: 500;">${formatDate(expense.date || expense.createdAt)}</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </div>
                    
                    <!-- Transaction Details Grid -->
                    <div style="padding: 24px; border-bottom: 1px solid #f0f0f0;">
                        <table width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                                <td width="50%" style="padding-bottom: 20px; vertical-align: top;">
                                    <p style="margin: 0; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Sender</p>
                                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #374151; font-weight: 500;">${expense.senderName || 'N/A'}</p>
                                </td>
                                <td width="50%" style="padding-bottom: 20px; vertical-align: top;">
                                    <p style="margin: 0; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Receiver</p>
                                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #374151; font-weight: 500;">${expense.receiverName || 'N/A'}</p>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="vertical-align: top;">
                                    <p style="margin: 0; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Transaction Type</p>
                                    <div style="margin-top: 8px;">
                                        <span style="display: inline-block; padding: 6px 14px; background: #fee2e2; color: #dc2626; border-radius: 20px; font-size: 12px; font-weight: 600;">
                                            💸 Expenditure
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    
                    ${expense.notes ? `
                    <!-- Notes -->
                    <div style="padding: 20px 24px; border-bottom: 1px solid #f0f0f0;">
                        <p style="margin: 0; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Notes</p>
                        <p style="margin: 8px 0 0 0; font-size: 14px; color: #4b5563; line-height: 1.6;">${expense.notes}</p>
                    </div>
                    ` : ''}
                    
                    <!-- Amount Section -->
                    <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 32px 24px; text-align: center;">
                        <p style="margin: 0; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Amount Spent</p>
                        <p style="margin: 10px 0 0 0; font-size: 42px; color: #dc2626; font-weight: 700;">${formatCurrency(expense.amount)}</p>
                    </div>
                    
                </div>
                
                <!-- Footer -->
                <div style="background: #1f2937; padding: 20px 24px; text-align: center; border-radius: 0 0 12px 12px;">
                    <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 12px;">This is a computer generated receipt</p>
                    <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.5); font-size: 11px;">Expenditure Record • ITSA Department</p>
                </div>
            </div>
        `;
    };

    const handleDownload = () => {
        const element = document.createElement('div');
        element.innerHTML = getPDFContent();
        element.style.padding = '20px';
        element.style.background = '#f3f4f6';
        document.body.appendChild(element);

        const opt = {
            margin: 10,
            filename: `Expense-${expense.receiptNumber || 'receipt'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            document.body.removeChild(element);
        });
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Expense Receipt - ${expense.receiptNumber}</title>
                <style>
                    body { margin: 0; padding: 20px; background: #f3f4f6; }
                    @media print {
                        body { background: white; padding: 0; }
                    }
                </style>
            </head>
            <body>
                ${getPDFContent()}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-slideUp">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Expense Receipt</h2>
                        <p className="text-sm text-gray-500">{expense.receiptNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Receipt Preview */}
                <div className="overflow-y-auto max-h-[60vh] p-4 bg-gray-50" ref={receiptRef}>
                    {/* Header Banner */}
                    <div className="bg-gradient-to-br from-red-600 to-red-500 rounded-t-xl p-6 text-center">
                        <div className="w-14 h-14 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <span className="text-2xl text-white">₹</span>
                        </div>
                        <h3 className="text-white font-bold text-lg">ITSA Accounts</h3>
                        <p className="text-red-100 text-sm">Official Expense Receipt</p>
                        <div className="mt-4 inline-block bg-white/20 px-4 py-2 rounded-full">
                            <span className="text-white text-sm font-semibold">{expense.receiptNumber}</span>
                        </div>
                    </div>

                    {/* Receipt Body */}
                    <div className="bg-white border border-gray-100 border-t-0 rounded-b-xl">
                        {/* Expense Info */}
                        <div className="p-4 border-b border-gray-100">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Description</p>
                            <p className="text-gray-800 font-medium mt-1">{expense.description}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 p-4 border-b border-gray-100">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Category</p>
                                <p className="text-gray-700 mt-1 capitalize">{expense.category}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Date</p>
                                <p className="text-gray-700 mt-1">{formatDate(expense.date || expense.createdAt)}</p>
                            </div>
                        </div>

                        {/* Sender/Receiver */}
                        <div className="grid grid-cols-2 gap-4 p-4 border-b border-gray-100">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Sender</p>
                                <p className="text-gray-700 mt-1">{expense.senderName || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Receiver</p>
                                <p className="text-gray-700 mt-1">{expense.receiverName || '-'}</p>
                            </div>
                        </div>

                        {expense.notes && (
                            <div className="p-4 border-b border-gray-100">
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Notes</p>
                                <p className="text-gray-600 mt-1 text-sm">{expense.notes}</p>
                            </div>
                        )}

                        {/* Amount */}
                        <div className="bg-gradient-to-r from-red-50 to-red-100/50 p-6 text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Amount Spent</p>
                            <p className="text-3xl font-bold text-red-600 mt-2">{formatCurrency(expense.amount)}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                    <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        <FiDownload className="w-4 h-4" />
                        Download PDF
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                        <FiPrinter className="w-4 h-4" />
                        Print
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseReceiptModal;
