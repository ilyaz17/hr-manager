import { WorkBook, WorkSheet, utils, write } from 'xlsx';
import { downloadFile } from './fileUtils';

interface AttendanceRecord {
  id: string;
  date: string;
  employeeName: string;
  employeeId: string;
  checkIn: string;
  checkOut: string;
  workingHours: string;
  status: 'present' | 'absent' | 'late' | 'half_day';
  remarks?: string;
}

interface PerformanceRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  period: string;
  rating: number;
  feedback: string;
  completionStatus: 'completed' | 'in_progress' | 'not_started';
  goals: string[];
}

/**
 * Export attendance data to Excel file
 */
export const exportAttendanceToExcel = async (
  attendanceRecords: AttendanceRecord[],
  fileName: string = 'attendance-report'
): Promise<void> => {
  try {
    const ws: WorkSheet = utils.json_to_sheet(attendanceRecords);

    // Set column widths
    const wscols = [
      { wch: 15 }, // id
      { wch: 15 }, // date
      { wch: 20 }, // employeeName
      { wch: 15 }, // employeeId
      { wch: 20 }, // checkIn
      { wch: 20 }, // checkOut
      { wch: 15 }, // workingHours
      { wch: 15 }, // status
      { wch: 30 }, // remarks
    ];
    ws['!cols'] = wscols;

    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Attendance');

    const excelBuffer = write(wb, { type: 'array', bookType: 'xlsx' });

    await downloadFile(
      excelBuffer,
      `${fileName}-${new Date().toISOString().split('T')[0]}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  } catch (error) {
    console.error('Error exporting attendance to Excel:', error);
    throw new Error('Failed to export attendance data');
  }
};

/**
 * Export payslip data to Excel file
 */
export const exportPayslipToExcel = async (
  payslipData: any,
  fileName: string = 'payslip'
): Promise<void> => {
  try {
    // Prepare earnings data
    const earnings = payslipData.earnings.map((earn: any) => ({
      Description: earn.name,
      Amount: earn.amount,
    }));

    // Prepare deductions data
    const deductions = payslipData.deductions.map((ded: any) => ({
      Description: ded.name,
      Amount: ded.amount,
    }));

    // Combine into single sheet
    const ws: WorkSheet = utils.json_to_sheet([
      ...earnings,
      { Description: 'Gross Salary', Amount: payslipData.grossSalary },
      ...deductions,
      { Description: 'Total Deductions', Amount: payslipData.totalDeductions },
      { Description: 'Net Salary', Amount: payslipData.netSalary },
    ]);

    // Set column widths
    const wscols = [
      { wch: 40 }, // Description
      { wch: 20 }, // Amount
    ];
    ws['!cols'] = wscols;

    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Payslip');

    const excelBuffer = write(wb, { type: 'array', bookType: 'xlsx' });

    await downloadFile(
      excelBuffer,
      `${fileName}-${payslipData.employeeId}-${new Date().toISOString().split('T')[0]}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  } catch (error) {
    console.error('Error exporting payslip to Excel:', error);
    throw new Error('Failed to export payslip data');
  }
};

/**
 * Export performance data to Excel file
 */
export const exportPerformanceToExcel = async (
  performanceRecords: PerformanceRecord[],
  fileName: string = 'performance-report'
): Promise<void> => {
  try {
    // Transform data for Excel
    const excelData = performanceRecords.map((record: PerformanceRecord) => ({
      'Employee ID': record.employeeId,
      'Employee Name': record.employeeName,
      Period: record.period,
      Rating: record.rating,
      'Feedback': record.feedback,
      'Status': record.completionStatus,
      Goals: record.goals.join('; '),
    }));

    const ws: WorkSheet = utils.json_to_sheet(excelData);

    // Set column widths
    const wscols = [
      { wch: 15 }, // Employee ID
      { wch: 25 }, // Employee Name
      { wch: 20 }, // Period
      { wch: 10 }, // Rating
      { wch: 50 }, // Feedback
      { wch: 20 }, // Status
      { wch: 40 }, // Goals
    ];
    ws['!cols'] = wscols;

    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Performance');

    const excelBuffer = write(wb, { type: 'array', bookType: 'xlsx' });

    await downloadFile(
      excelBuffer,
      `${fileName}-${new Date().toISOString().split('T')[0]}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  } catch (error) {
    console.error('Error exporting performance to Excel:', error);
    throw new Error('Failed to export performance data');
  }
};

/**
 * Export multiple records to Excel with multiple sheets
 */
export const exportMultipleSheetsToExcel = async (
  sheetData: Array<{ name: string; data: any[] }>
): Promise<void> => {
  try {
    const wb: WorkBook = utils.book_new();

    sheetData.forEach((sheet) => {
      const ws: WorkSheet = utils.json_to_sheet(sheet.data);

      // Set column widths if data exists
      if (sheet.data.length > 0) {
        const colWidths = Object.keys(sheet.data[0]).map((key) => ({
          wch: Math.max(key.length, ...sheet.data.map((row) => String(row[key]).length)),
        }));
        ws['!cols'] = colWidths;
      }

      utils.book_append_sheet(wb, ws, sheet.name);
    });

    const excelBuffer = write(wb, { type: 'array', bookType: 'xlsx' });

    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `export-${timestamp}`;

    await downloadFile(
      excelBuffer,
      `${fileName}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  } catch (error) {
    console.error('Error exporting multiple sheets to Excel:', error);
    throw new Error('Failed to export multiple sheets');
  }
};

/**
 * Generate summary statistics for Excel export
 */
export const generateSummaryStats = (data: any[]): any => {
  const totalPresent = data.filter((d) => d.status === 'present').length;
  const totalAbsent = data.filter((d) => d.status === 'absent').length;
  const totalLate = data.filter((d) => d.status === 'late').length;
  const totalHours = data.reduce((sum, d) => sum + parseFloat(d.workingHours || 0), 0);

  return {
    'Total Records': data.length,
    'Present': totalPresent,
    'Absent': totalAbsent,
    'Late': totalLate,
    'Average Hours': (totalHours / data.length).toFixed(2),
  };
};

export default {
  exportAttendanceToExcel,
  exportPayslipToExcel,
  exportPerformanceToExcel,
  exportMultipleSheetsToExcel,
  generateSummaryStats,
};