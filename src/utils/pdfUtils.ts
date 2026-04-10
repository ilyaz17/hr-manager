import * as FileSystem from 'expo-file-system';

/**
 * PDF Export Utility for HR Manager App
 * Generates PDF files for payslips, attendance reports, and performance reviews
 */

interface ExportOptions {
  fileName?: string;
  directory?: string;
  base64?: boolean;
}

/**
 * Escape HTML special characters
 */
const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Create HTML content from data
 */
export const createPayslipHTML = (
  payslip: any,
  companyInfo: any
): string => {
  const {
    employeeName,
    employeeId,
    period,
    payDate,
    grossPay,
    netPay,
    deductions,
    benefits,
    allowances
  } = payslip;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .company-name { font-size: 24px; font-weight: bold; color: #2563eb; }
        .title { font-size: 18px; color: #666; margin: 5px 0; }
        .section { margin: 15px 0; }
        .section-title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 10px; border-left: 4px solid #2563eb; padding-left: 10px; }
        .row { display: flex; justify-content: space-between; margin: 8px 0; padding: 5px; background: #f9fafb; }
        .label { font-weight: 500; color: #555; }
        .value { color: #1f2937; font-weight: 600; }
        .total { background: #eff6ff; border: 2px solid #2563eb; padding: 10px; margin-top: 10px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
        .status-paid { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-late { background: #fee2e2; color: #991b1b; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">${escapeHtml(companyInfo?.name || 'HR Manager')}</div>
        <div class="title">Detailed Earnings Statement</div>
        <div>${new Date().toLocaleDateString()}</div>
      </div>

      <div class="section">
        <div class="section-title">Employee Information</div>
        <div class="row">
          <span class="label">Employee Name:</span>
          <span class="value">${escapeHtml(employeeName)}</span>
        </div>
        <div class="row">
          <span class="label">Employee ID:</span>
          <span class="value">${escapeHtml(employeeId)}</span>
        </div>
        <div class="row">
          <span class="label">Pay Period:</span>
          <span class="value">${escapeHtml(period)}</span>
        </div>
        <div class="row">
          <span class="label">Payment Date:</span>
          <span class="value">${new Date(payDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Earnings</div>
        ${allowances?.map((allowance: any) => `
          <div class="row">
            <span class="label">${escapeHtml(allowance.type)}:</span>
            <span class="value">₹${allowance.amount.toLocaleString()}</span>
          </div>
        `).join('')}
        <div class="row total">
          <span class="label">Gross Pay:</span>
          <span class="value">₹${grossPay.toLocaleString()}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Deductions</div>
        ${deductions.map((deduction: any) => `
          <div class="row">
            <span class="label">${escapeHtml(deduction.type)}:</span>
            <span class="value">-₹${deduction.amount.toLocaleString()}</span>
          </div>
        `).join('')}
        <div class="row total">
          <span class="label">Total Deductions:</span>
          <span class="value">₹${deductions.reduce((sum: number, d: any) => sum + d.amount, 0).toLocaleString()}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Benefits</div>
        ${benefits.map((benefit: any) => `
          <div class="row">
            <span class="label">${escapeHtml(benefit.type)}:</span>
            <span class="value">+₹${benefit.amount.toLocaleString()}</span>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <div class="section-title">Payment Summary</div>
        <div class="row total" style="background: #ecfdf5;">
          <span class="label">Net Pay (Take Home):</span>
          <span class="value" style="color: #166534; font-size: 20px;">₹${netPay.toLocaleString()}</span>
        </div>
        <div class="row">
          <span class="label">Status:</span>
          <span class="value status-badge status-${payslip.status}">${payslip.status.toUpperCase()}</span>
        </div>
      </div>

      <div class="footer">
        <p>Generated by HR Manager System</p>
        <p>For queries, contact HR Department at hr@company.com</p>
        <p>© ${new Date().getFullYear()} HR Manager. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate PDF from HTML content
 */
export const generatePDF = async (
  htmlContent: string,
  options: ExportOptions = {}
): Promise<string | null> => {
  try {
    const {
      fileName = 'document',
      directory = FileSystem.documentDirectory,
      base64 = false,
    } = options;

    const pdfPath = `${directory}${fileName}.pdf`;

    await FileSystem.writeAsStringAsync(pdfPath, htmlContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return pdfPath;
  } catch (error) {
    console.error('PDF generation error:', error);
    return null;
  }
};

/**
 * Share PDF file using Share API
 */
export const sharePDF = async (
  filePath: string
): Promise<boolean> => {
  try {
    const { Share } = await import('expo-sharing');
    const canShare = await Share.isAvailableAsync();

    if (!canShare) {
      console.warn('Sharing is not available on this device');
      return false;
    }

    await Share.shareAsync(filePath, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share Payslip',
      UTI: 'com.adobe.pdf',
    });

    return true;
  } catch (error) {
    console.error('Share failed:', error);
    return false;
  }
};

/**
 * Save PDF to device storage
 */
export const savePDFToFileSystem = async (
  filePath: string
): Promise<string | null> => {
  try {
    // Copy from document directory to public downloads
    const pdfName = filePath.split('/').pop() || 'document.pdf';
    const destinationPath = `${FileSystem.downloadDirectory}${pdfName}`;

    await FileSystem.copyAsync({
      from: filePath,
      to: destinationPath,
    });

    return destinationPath;
  } catch (error) {
    console.error('Save failed:', error);
    return null;
  }
};

/**
 * Generate Attendance Report HTML
 */
export const createAttendanceHTML = (
  reports: any[],
  period: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .title { font-size: 20px; font-weight: bold; color: #2563eb; }
        .subtitle { font-size: 14px; color: #666; margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #2563eb; color: white; padding: 10px; text-align: left; font-size: 14px; }
        td { padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
        tr:nth-child(even) { background: #f9fafb; }
        tr:hover { background: #eff6ff; }
        .status-present { color: #166534; font-weight: 600; }
        .status-absent { color: #991b1b; font-weight: 600; }
        .status-late { color: #92400e; font-weight: 600; }
        .status-half-day { color: #7c2d12; font-weight: 600; }
        .summary { margin-top: 15px; padding: 10px; background: #f3f4f6; border-radius: 4px; }
        .summary-row { display: flex; justify-content: space-between; margin: 5px 0; }
        .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">Attendance Report</div>
        <div class="subtitle">Period: ${escapeHtml(period)}</div>
        <div>${new Date().toLocaleDateString()}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee Name</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Working Hours</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${reports.map((report) => `
            <tr>
              <td>${new Date(report.reportDate).toLocaleDateString()}</td>
              <td>${escapeHtml(report.employeeName)}</td>
              <td>${escapeHtml(report.checkInTime)}</td>
              <td>${escapeHtml(report.checkOutTime)}</td>
              <td>${escapeHtml(report.totalWorkingHours)}</td>
              <td class="status-${report.status}">${escapeHtml(report.status.toUpperCase())}</td>
              <td>${escapeHtml(report.remarks || '-')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="summary">
        <div class="summary-row">
          <span class="label">Total Entries:</span>
          <span class="value">${reports.length}</span>
        </div>
      </div>

      <div class="footer">
        <p>Generated by HR Manager System</p>
        <p>© ${new Date().getFullYear()} HR Manager. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate Performance Review HTML
 */
export const createPerformanceHTML = (
  review: any,
  ratingScale: any[]
): string => {
  const rating = ratingScale.find((r) => r.id === review.rating) || ratingScale[0];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .title { font-size: 20px; font-weight: bold; color: #2563eb; }
        .subtitle { font-size: 14px; color: #666; margin: 5px 0; }
        .section { margin: 15px 0; }
        .section-title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 10px; border-left: 4px solid #2563eb; padding-left: 10px; }
        .row { display: flex; justify-content: space-between; margin: 8px 0; padding: 5px; background: #f9fafb; }
        .label { font-weight: 500; color: #555; }
        .value { color: #1f2937; font-weight: 600; }
        .feedback { background: #f3f4f6; padding: 15px; border-radius: 4px; margin: 10px 0; }
        .rating-badge { display: inline-block; padding: 8px 16px; border-radius: 12px; font-size: 14px; font-weight: 600; }
        .rating-high { background: #dcfce7; color: #166534; }
        .rating-medium { background: #fef3c7; color: #92400e; }
        .rating-low { background: #fee2e2; color: #991b1b; }
        .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">Performance Review</div>
        <div class="subtitle">Employee: ${escapeHtml(review.employeeName)}</div>
        <div class="subtitle">Period: ${escapeHtml(review.period)}</div>
      </div>

      <div class="section">
        <div class="section-title">Review Details</div>
        <div class="row">
          <span class="label">Employee ID:</span>
          <span class="value">${escapeHtml(review.employeeId)}</span>
        </div>
        <div class="row">
          <span class="label">Review Period:</span>
          <span class="value">${escapeHtml(review.period)}</span>
        </div>
        <div class="row">
          <span class="label">Date:</span>
          <span class="value">${new Date(review.date).toLocaleDateString()}</span>
        </div>
        <div class="row">
          <span class="label">Rating:</span>
          <span class="value rating-badge rating-${
            rating.value > 4 ? 'high' : rating.value > 3 ? 'medium' : 'low'
          }">
            ${rating.label} (${review.rating}/5)
          </span>
        </div>
        <div class="row">
          <span class="label">Overall:</span>
          <span class="value">${escapeHtml(review.overall)}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Key Achievements</div>
        <div class="feedback">
          ${review.achievements
            .map((item: string) => `<div>✓ ${escapeHtml(item)}</div>`)
            .join('')}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Areas of Improvement</div>
        <div class="feedback">
          ${review.improvements
            .map((item: string) => `<div>• ${escapeHtml(item)}</div>`)
            .join('')}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Manager Comments</div>
        <div class="feedback">
          <p style="margin: 0;">${escapeHtml(review.comments || 'No additional comments')}</p>
        </div>
      </div>

      <div class="footer">
        <p>Generated by HR Manager System</p>
        <p>© ${new Date().getFullYear()} HR Manager. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

export { generatePDF, sharePDF, savePDFToFileSystem };
