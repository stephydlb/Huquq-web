import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Payment, SurplusCalculation } from '../types';

export class PdfService {
  /**
   * Generate payment receipt PDF
   */
  static async generatePaymentReceipt(payment: Payment, calculation?: SurplusCalculation): Promise<string> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Header
    pdf.setFontSize(20);
    pdf.text('Ḥuqúqu’lláh Assistant', pageWidth / 2, 20, { align: 'center' });

    pdf.setFontSize(16);
    pdf.text('Reçu de Paiement', pageWidth / 2, 35, { align: 'center' });

    // Payment details
    pdf.setFontSize(12);
    let yPosition = 60;

    pdf.text(`ID du paiement: ${payment.id}`, 20, yPosition);
    yPosition += 10;

    pdf.text(`Date: ${payment.date.toLocaleDateString('fr-FR')}`, 20, yPosition);
    yPosition += 10;

    pdf.text(`Montant: ${payment.amount.toFixed(2)} ${payment.currency}`, 20, yPosition);
    yPosition += 10;

    if (payment.goldAmount) {
      pdf.text(`Quantité d'or: ${payment.goldAmount.toFixed(3)} mithqāl`, 20, yPosition);
      yPosition += 10;
    }

    pdf.text(`Méthode: ${this.getPaymentMethodLabel(payment.method)}`, 20, yPosition);
    yPosition += 10;

    if (payment.note) {
      pdf.text(`Note: ${payment.note}`, 20, yPosition);
      yPosition += 15;
    }

    // Calculation details if provided
    if (calculation) {
      pdf.text('Détails du Calcul:', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.text(`Revenus totaux: ${calculation.totalIncome.toFixed(2)} ${calculation.totalExpenses > 0 ? 'EUR' : 'EUR'}`, 30, yPosition);
      yPosition += 8;

      pdf.text(`Dépenses essentielles: ${calculation.essentialExpenses.toFixed(2)} EUR`, 30, yPosition);
      yPosition += 8;

      pdf.text(`Surplus: ${calculation.surplus.toFixed(2)} EUR`, 30, yPosition);
      yPosition += 8;

      pdf.text(`Ḥuqúqu’lláh (19%): ${calculation.huquqAmount.toFixed(2)} EUR`, 30, yPosition);
      yPosition += 8;

      pdf.text(`Montant restant: ${calculation.remainingAmount.toFixed(2)} EUR`, 30, yPosition);
      yPosition += 15;
    }

    // Footer
    pdf.setFontSize(8);
    pdf.text('Ce reçu est généré automatiquement par Ḥuqúqu’lláh Assistant', pageWidth / 2, pageHeight - 20, { align: 'center' });
    pdf.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Return as blob URL
    const blob = pdf.output('blob');
    return URL.createObjectURL(blob);
  }

  /**
   * Generate calculation report PDF
   */
  static async generateCalculationReport(calculation: SurplusCalculation): Promise<string> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Header
    pdf.setFontSize(20);
    pdf.text('Ḥuqúqu’lláh Assistant', pageWidth / 2, 20, { align: 'center' });

    pdf.setFontSize(16);
    pdf.text('Rapport de Calcul', pageWidth / 2, 35, { align: 'center' });

    // Period
    pdf.setFontSize(12);
    pdf.text(`Période: ${calculation.period.start.toLocaleDateString('fr-FR')} - ${calculation.period.end.toLocaleDateString('fr-FR')}`, pageWidth / 2, 50, { align: 'center' });

    // Details
    let yPosition = 70;

    pdf.setFontSize(14);
    pdf.text('Résumé Financier:', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(11);
    const details = [
      ['Revenus totaux', `${calculation.totalIncome.toFixed(2)} EUR`],
      ['Dépenses totales', `${calculation.totalExpenses.toFixed(2)} EUR`],
      ['Dépenses essentielles', `${calculation.essentialExpenses.toFixed(2)} EUR`],
      ['Dépenses non-essentielles', `${calculation.nonEssentialExpenses.toFixed(2)} EUR`],
      ['Surplus', `${calculation.surplus.toFixed(2)} EUR`],
      ['Ḥuqúqu’lláh (19%)', `${calculation.huquqAmount.toFixed(2)} EUR`],
      ['Montant restant', `${calculation.remainingAmount.toFixed(2)} EUR`]
    ];

    details.forEach(([label, value]) => {
      pdf.text(`${label}:`, 30, yPosition);
      pdf.text(value, pageWidth - 50, yPosition, { align: 'right' });
      yPosition += 8;
    });

    // Footer
    pdf.setFontSize(8);
    pdf.text('Ce rapport est généré automatiquement par Ḥuqúqu’lláh Assistant', pageWidth / 2, 280, { align: 'center' });
    pdf.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, pageWidth / 2, 290, { align: 'center' });

    const blob = pdf.output('blob');
    return URL.createObjectURL(blob);
  }

  /**
   * Export transactions to CSV
   */
  static exportTransactionsToCSV(transactions: any[]): string {
    if (transactions.length === 0) return '';

    const headers = ['Date', 'Type', 'Montant', 'Description', 'Catégorie', 'Essentiel'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.date.toLocaleDateString('fr-FR'),
        t.type === 'income' ? 'Revenu' : 'Dépense',
        t.amount.toFixed(2),
        `"${t.description}"`,
        `"${t.category}"`,
        t.isEssential ? 'Oui' : 'Non'
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * Download file from blob URL
   */
  static downloadFromBlobUrl(blobUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private static getPaymentMethodLabel(method: string): string {
    const methods: Record<string, string> = {
      cash: 'Espèces',
      bank: 'Virement bancaire',
      gold: 'Or physique'
    };
    return methods[method] || method;
  }
}
