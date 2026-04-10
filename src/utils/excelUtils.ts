import { Filesystem, Directory } from '@capacitor/filesystem';
import * as XLSX from 'xlsx';

export interface PayslipData {
  id: string;
  employeeName: string;
  employeeId: string;
  period: string;
  payDate: string;
  grossPay: number;
  netPay: number;
  deductions: Array<{ type: string; amount: number }>;
  benefits: Array<{ type: string; amount: number }>;
  allowances: Array<{ type: string; amount: number }>;
  status: 'paid' | 'pending' | 'late';
}

export interface AttendanceData {
  id: string;
  employeeName: string;
  employeeId: string;
  reportDate: string;
  checkInTime: string;
  checkOutTime: string;
  totalWorkingHours: string;
  status: 'present' | 'absent' | 'late' | 'half_day';
  remarks?: string;
}

export interface PerformanceData {
  id: string;
  employeeName: string;
  employeeId: string;
  rating: number;
  period: string;
  date: string;
  overall: string;
  achievements: string[];
  improvements: string[];
  comments?: string;
}

/**
 * Format currency for Excel export
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/**
 * Export payslips to Excel
 */
export const exportPayslipsToExcel = async (
  payslips: PayslipData[],
  fileName: string = 'Payslips'
): Promise<string> => {
  try {
    // Create worksheet header
    const header = [
      'Employee Name',
      'Employee ID',
      'Period',
      'Pay Date',
      'Gross Pay',
      'Deductions',
      'Benefits',
      'Allowances',
      'Net Pay',
      'Status'
    ];

    // Create worksheet data
    const data = payslips.map((payslip) => {
      const totalDeductions = payslip.deductions.reduce((sum, d) => sum + d.amount, 0);
      const totalBenefits = payslip.benefits.reduce((sum, b) => sum + b.amount, 0);
      const totalAllowances = payslip.allowances.reduce((sum, a) => sum + a.amount, 0);

      return [
        payslip.employeeName,
        payslip.employeeId,
        payslip.period,
        new Date(payslip.payDate).toLocaleDateString(),
        formatCurrency(payslip.grossPay),
        formatCurrency(totalDeductions),
        formatCurrency(totalBenefits),
        formatCurrency(totalAllowances),
        formatCurrency(payslip.netPay),
        payslip.status.toUpperCase()
      ];
    });

    const worksheetData = [header, ...data];

    return await writeExcelFile(worksheetData, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Export payslips failed:', error);
    throw error;
  }
};

/**
 * Export attendance data to Excel
 */
export const exportAttendanceToExcel = async (
  attendance: AttendanceData[],
  fileName: string = 'Attendance_Report',
  period?: string
): Promise<string> => {
  try {
    const header = [
      'Date',
      'Employee Name',
      'Employee ID',
      'Check In',
      'Check Out',
      'Working Hours',
      'Status',
      'Remarks'
    ];

    const data = attendance.map((record) => [
      new Date(record.reportDate).toLocaleDateString(),
      record.employeeName,
      record.employeeId,
      record.checkInTime,
      record.checkOutTime,
      record.totalWorkingHours,
      record.status.toUpperCase(),
      record.remarks || ''
    ]);

    const worksheetData = [
      header,
      ...(period ? [['Period:', period, '', '', '', '', '']] : []),
      ...data
    ];

    return await writeExcelFile(worksheetData, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Export attendance failed:', error);
    throw error;
  }
};

/**
 * Export performance reviews to Excel
 */
export const exportPerformanceToExcel = async (
  performance: PerformanceData[],
  fileName: string = 'Performance_Reviews'
): Promise<string> => {
  try {
    const header = [
      'Employee Name',
      'Employee ID',
      'Rating (out of 5)',
      'Period',
      'Date',
      'Overall',
      'Key Achievements',
      'Areas of Improvement',
      'Comments'
    ];

    const data = performance.map((review) => [
      review.employeeName,
      review.employeeId,
      review.rating,
      review.period,
      new Date(review.date).toLocaleDateString(),
      review.overall,
      review.achievements.join(' | '),
      review.improvements.join(' | '),
      review.comments || ''
    ]);

    const worksheetData = [header, ...data];

    return await writeExcelFile(worksheetData, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Export performance failed:', error);
    throw error;
  }
};

/**
 * Export employee list to Excel
 */
export const exportEmployeesToExcel = async (
  employees: Array<any>,
  fileName: string = 'Employee_List'
): Promise<string> => {
  try {
    const header = [
      'Employee ID',
      'Full Name',
      'Email',
      'Phone',
      'Department',
      'Designation',
      'Joining Date',
      'Salary',
      'Status',
      'Manager'
    ];

    const data = employees.map((emp) => [
      emp.employeeId,
      emp.fullName,
      emp.email || '',
      emp.phone || '',
      emp.department || '',
      emp.designation || '',
      new Date(emp.joiningDate).toLocaleDateString(),
      formatCurrency(emp.salary),
      emp.status?.toUpperCase() || 'ACTIVE',
      emp.managerName || ''
    ]);

    const worksheetData = [header, ...data];

    return await writeExcelFile(worksheetData, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Export employees failed:', error);
    throw error;
  }
};

/**
 * Export multiple sheets to Excel
 */
export const exportMultipleSheetsToExcel = async (
  sheets: Array<{ name: string; data: any[][] }>,
  fileName: string = 'HR_Report'
): Promise<string> => {
  try {
    const workbook = XLSX.utils.book_new();

    for (const sheet of sheets) {
      const worksheet = XLSX.utils.aoa_to_sheet(sheet.data);

      // Set column widths based on data
      const wscols = sheet.data[0].map((_, i) => ({
        wch: Math.max(
          sheet.data.reduce((max, row) => 
            Math.max(max, (row[i] || '').toString().length), 10)
        )
      }));
      worksheet['!cols'] = wscols;

      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    }

    return await saveExcelWorkbook(workbook, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Export multiple sheets failed:', error);
    throw error;
  }
};

/**
 * Write Excel file and save to device storage
 */
async function writeExcelFile(data: any[][], fileName: string): Promise<string> {
  try {
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Apply basic styling
    const wscols = data[0].map((_, i) => ({
      wch: Math.max(data.reduce((max, row) => Math.max(max, (row[i] || '').toString().length), 10))
    }));
    ws['!cols'] = wscols;

    // Add header row style
    const headerRow = data[0].map((_, i) => `A${i+1}`);
    if (ws['!refs']) {
      ws['!refs'].expand = {
        s: { r: 0, c: 0 },
        e: { r: data.length, c: data[0].length - 1 }
      };
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const base64String = buffer.toString('base64');
    const filePath = `${Directory.Cache}/${fileName}`;

    // Convert base64 to file
    await Filesystem.writeFile({
      path: filePath,
      data: base64String,
      directory: Directory.Cache,
    });

    return filePath;
  } catch (error) {
    console.error('Excel file creation failed:', error);
    throw error;
  }
}

/**
 * Save Excel workbook to device
 */
async function saveExcelWorkbook(workbook: XLSX.WorkBook, fileName: string): Promise<string> {
  try {
    const base64String = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    const filePath = `${Directory.Cache}/${fileName}`;

    await Filesystem.writeFile({
      path: filePath,
      data: base64String,
      directory: Directory.Cache,
    });

    return filePath;
  } catch (error) {
    console.error('Save workbook failed:', error);
    throw error;
  }
}

/**
 * Share Excel file using Share API
 */
export const shareExcelFile = async (filePath: string): Promise<boolean> => {
  try {
    const { Share } = await import('expo-sharing');
    const canShare = await Share.isAvailableAsync();

    if (!canShare) {
      console.warn('Sharing is not available on this device');
      return false;
    }

    const shareData = {
      title: 'HR Report',
      url: `file://${filePath}`,
    };

    await Share.shareAsync(shareData.url, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Share Report',
    });

    return true;
  } catch (error) {
    console.error('Share failed:', error);
    return false;
  }
};

/**
 * Download Excel file to public storage
 */
export const downloadExcelFile = async (filePath: string, fileName: string): Promise<string | null> => {
  try {
    const destinationPath = `${Directory.Download}/${fileName}`;

    await Filesystem.copy({
      from: filePath,
      to: destinationPath,
    });

    return destinationPath;
  } catch (error) {
    console.error('Download failed:', error);
    return null;
  }
};

/**
 * Generate comprehensive HR report sheet
 */
export const generateHROverviewSheet = async (
  employees: number,
  attendance: number,
  leaves: number,
  performances: number,
  payslips: number
): Promise<string> => {
  try {
    const sheetData = [
      ['HR Overview Report', '', '', '', ''],
      [new Date().toLocaleDateString()],
      ['', '', '', '', ''],
      ['Metric', 'Count', '', '', ''],
      ['Total Employees', employees, '', '', ''],
      ['Attendance Records', attendance, '', '', ''],
      ['Leave Requests', leaves, '', '', ''],
      ['Performance Reviews', performances, '', '', ''],
      ['Payslips Generated', payslips, '', '', ''],
      ['', '', '', '', ''],
      ['Report Generated By', 'HR Manager System', '', '', ''],
    ];

    return await writeExcelFile(sheetData, 'HR_Overview.xlsx');
  } catch (error) {
    console.error('Overview export failed:', error);
    throw error;
  }
};

export { writeExcelFile, saveExcelWorkbook, shareExcelFile, downloadExcelFile };
export type { PayslipData, AttendanceData, PerformanceData };
