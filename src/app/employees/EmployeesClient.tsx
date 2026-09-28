'use client';

import React, { useState } from 'react';
import CreateEmployeeModal from './CreateEmployeeModal';
import CreateFinancialMoveModal from './CreateFinancialMoveModal';
import LoanModal from './LoanModal';
import LeaveModal from './LeaveModal';
import AttendanceModal from './AttendanceModal';
import BiometricImportModal from './BiometricImportModal';
import { 
  createEmployee, 
  updateEmployee, 
  createFinancialMove, 
  deleteFinancialMove, 
  approveFinancialMove, 
  updateFinancialMove, 
  createEmployeeLeave, 
  updateEmployeeLeave, 
  deleteEmployeeLeave, 
  updateEmployeeLeaveStatus,
  getAttendances,
  deleteAttendance,
  getMonthlyAttendanceReport,
  resetEmployeeDevice
} from './actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployeesClient({ initialEmployees, initialMoves, branches = [], lang, dict }: { initialEmployees: any[], initialMoves: any[], branches?: any[], lang: string, dict: any }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [editingMove, setEditingMove] = useState<any>(null);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'timesheet' | 'financial' | 'rewards' | 'loans' | 'leaves'>('employees');
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loans, setLoans] = useState<any[]>([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [editingLeave, setEditingLeave] = useState<any>(null);
  const [leaves, setLeaves] = useState<any[]>([]);
  
  // Helper for today's local date YYYY-MM-DD
  const getTodayLocal = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Attendance State
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<any>(null);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [attendanceDate, setAttendanceDate] = useState<string>(getTodayLocal());
  const [attendanceFilterEmp, setAttendanceFilterEmp] = useState<string>('ALL');

  // Monthly Timesheet State
  const now = new Date();
  const [timesheetYear, setTimesheetYear] = useState<number>(now.getFullYear());
  const [timesheetMonth, setTimesheetMonth] = useState<number>(now.getMonth() + 1);
  const [timesheetData, setTimesheetData] = useState<any[]>([]);
  const [timesheetMeta, setTimesheetMeta] = useState<any>(null);
  const [loadingTimesheet, setLoadingTimesheet] = useState<boolean>(false);

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [moves, setMoves] = useState<any[]>(initialMoves || []);
  const [employees, setEmployees] = useState<any[]>(initialEmployees || []);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
    setAttendanceDate(getTodayLocal());
  }, []);

  React.useEffect(() => {
    setEmployees(initialEmployees || []);
    setMoves(initialMoves || []);
  }, [initialEmployees, initialMoves]);

  const formatDate = (date: any) => {
    if (!date) return '-';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '-';
      if (!mounted) return d.toISOString().split('T')[0];
      return d.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US');
    } catch {
      return '-';
    }
  };

  const fetchLoans = async () => {
    try {
      const res = await fetch('/api/v1/employees/loans');
      if (res.ok) setLoans(await res.json());
    } catch { /* silent */ }
  };

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/v1/employees/leaves');
      if (res.ok) setLeaves(await res.json());
    } catch { /* silent */ }
  };

  const fetchAttendances = async () => {
    try {
      const res = await getAttendances({
        date: attendanceDate || undefined,
        employeeId: attendanceFilterEmp !== 'ALL' ? attendanceFilterEmp : undefined
      });
      if (res.success && res.attendances) {
        setAttendances(res.attendances);
      }
    } catch { /* silent */ }
  };

  const fetchTimesheet = async () => {
    setLoadingTimesheet(true);
    try {
      const res = await getMonthlyAttendanceReport(timesheetYear, timesheetMonth);
      if (res.success && res.report) {
        setTimesheetData(res.report);
        setTimesheetMeta(res.meta);
      }
    } catch { /* silent */ } finally {
      setLoadingTimesheet(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'loans') fetchLoans();
    if (activeTab === 'leaves') fetchLeaves();
    if (activeTab === 'attendance') fetchAttendances();
    if (activeTab === 'timesheet') fetchTimesheet();
  }, [activeTab, attendanceDate, attendanceFilterEmp, timesheetYear, timesheetMonth]);

  const printEmployeeTimesheet = (row: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const empName = lang === 'ar' && row.nameAr ? row.nameAr : row.name;
    const isAr = lang === 'ar';
    const direction = isAr ? 'rtl' : 'ltr';
    const monthNamesAr = ['', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const monthNamesEn = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthTitle = isAr ? `${monthNamesAr[timesheetMonth]} ${timesheetYear}` : `${monthNamesEn[timesheetMonth]} ${timesheetYear}`;

    const totalLateMins = (row.totalLateMinutes || 0) + (row.totalEarlyMinutes || 0);
    const lateHours = Math.floor(totalLateMins / 60);
    const lateM = totalLateMins % 60;
    const lateTimeStr = totalLateMins > 0 ? `${lateHours > 0 ? `${lateHours}س ` : ''}${lateM}د` : '0';

    const rate = row.expectedWorkDays > 0 
      ? Math.min(100, Math.round((row.presentDays / row.expectedWorkDays) * 100))
      : 100;

    const html = `
      <!DOCTYPE html>
      <html dir="${direction}" lang="${lang}">
      <head>
        <title>${isAr ? `كشف حضور الموظف - ${empName}` : `Employee Attendance Timesheet - ${empName}`}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; color: #0f172a; margin: 0; padding: 30px; }
          .container { max-width: 850px; margin: 0 auto; border: 2px solid #e2e8f0; border-radius: 12px; padding: 30px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
          .header { text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 25px; }
          .header h1 { margin: 0; font-size: 26px; color: #1e293b; font-weight: 800; }
          .header p { margin: 6px 0 0; color: #64748b; font-size: 14px; font-weight: 600; }
          .emp-banner { display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 24px; margin-bottom: 25px; }
          .emp-banner-col { display: flex; flex-direction: column; gap: 4px; }
          .emp-label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 700; }
          .emp-val { font-size: 16px; font-weight: 800; color: #0f172a; }
          
          .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
          .metric-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; text-align: center; }
          .metric-title { font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 6px; }
          .metric-val { font-size: 20px; font-weight: 800; }
          
          .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 35px; }
          .summary-table th, .summary-table td { border: 1px solid #e2e8f0; padding: 12px 16px; font-size: 14px; }
          .summary-table th { background: #f1f5f9; font-weight: 700; text-align: ${isAr ? 'right' : 'left'}; color: #334155; }
          .summary-table td { font-weight: 600; text-align: ${isAr ? 'left' : 'right'}; }
          
          .signatures { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 50px; text-align: center; }
          .sig-box { border-top: 2px dashed #cbd5e1; padding-top: 10px; }
          .sig-title { font-weight: 700; color: #475569; font-size: 13px; }
          @media print {
            body { padding: 0; }
            .container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${isAr ? 'كشف ساعات الدوام والحضور الشهري' : 'Monthly Attendance Timesheet'}</h1>
            <p>${isAr ? `عن شهر: ${monthTitle}` : `For Month: ${monthTitle}`}</p>
          </div>

          <div class="emp-banner">
            <div class="emp-banner-col">
              <span class="emp-label">${isAr ? 'اسم الموظف' : 'Employee Name'}</span>
              <span class="emp-val">${empName}</span>
            </div>
            <div class="emp-banner-col">
              <span class="emp-label">${isAr ? 'الرقم الوظيفي' : 'Employee Code'}</span>
              <span class="emp-val">${row.code}</span>
            </div>
            <div class="emp-banner-col">
              <span class="emp-label">${isAr ? 'القسم / المسمى' : 'Department / Title'}</span>
              <span class="emp-val">${row.department || '-'} / ${isAr && row.jobTitleAr ? row.jobTitleAr : (row.jobTitle || '-')}</span>
            </div>
            <div class="emp-banner-col">
              <span class="emp-label">${isAr ? 'مواعيد الوردية' : 'Shift Hours'}</span>
              <span class="emp-val">${row.shiftStart} - ${row.shiftEnd} (${row.workHoursPerDay} ${isAr ? 'س/ي' : 'h/d'})</span>
            </div>
          </div>

          <div class="metrics-grid">
            <div class="metric-card" style="border-top: 3px solid #16a34a;">
              <div class="metric-title">${isAr ? 'أيام الحضور' : 'Present Days'}</div>
              <div class="metric-val" style="color: #16a34a;">${row.presentDays} ${isAr ? 'يوم' : 'd'}</div>
            </div>
            <div class="metric-card" style="border-top: 3px solid #2563eb;">
              <div class="metric-title">${isAr ? 'ساعات العمل الفعلية' : 'Actual Work Hours'}</div>
              <div class="metric-val" style="color: #2563eb;">${row.totalActualHours} ${isAr ? 'ساعة' : 'hrs'}</div>
            </div>
            <div class="metric-card" style="border-top: 3px solid #d97706;">
              <div class="metric-title">${isAr ? 'إجمالي التأخير' : 'Total Delay'}</div>
              <div class="metric-val" style="color: #d97706;">${lateTimeStr}</div>
            </div>
            <div class="metric-card" style="border-top: 3px solid ${rate >= 90 ? '#16a34a' : '#dc2626'};">
              <div class="metric-title">${isAr ? 'نسبة الالتزام' : 'Attendance Rate'}</div>
              <div class="metric-val" style="color: ${rate >= 90 ? '#16a34a' : '#dc2626'};">${rate}%</div>
            </div>
          </div>

          <table class="summary-table">
            <tr>
              <th>${isAr ? 'إجمالي أيام الشهر التقويمي' : 'Total Days in Month'}</th>
              <td>${row.totalDaysInMonth} ${isAr ? 'يوم' : 'Days'}</td>
            </tr>
            <tr>
              <th>${isAr ? 'أيام الدوام المتوقعة (المطلوبة)' : 'Expected Working Days'}</th>
              <td>${row.expectedWorkDays} ${isAr ? 'يوم' : 'Days'}</td>
            </tr>
            <tr>
              <th>${isAr ? 'ساعات الدوام المطلوبة' : 'Required Working Hours'}</th>
              <td>${row.expectedTotalHours} ${isAr ? 'ساعة' : 'Hours'}</td>
            </tr>
            <tr>
              <th>${isAr ? 'أيام الغياب' : 'Absent Days'}</th>
              <td style="color: #dc2626; font-weight: 800;">${row.absentDays} ${isAr ? 'يوم' : 'Days'}</td>
            </tr>
            <tr>
              <th>${isAr ? 'أيام الإجازات الرسمية المعتمدة' : 'Approved Leaves'}</th>
              <td style="color: #7c3aed;">${row.approvedLeaveDays} ${isAr ? 'يوم' : 'Days'}</td>
            </tr>
            <tr>
              <th>${isAr ? 'أيام العطلات الأسبوعية' : 'Weekends'}</th>
              <td>${row.weekendDaysCount} ${isAr ? 'يوم' : 'Days'}</td>
            </tr>
          </table>

          <div class="signatures">
            <div class="sig-box">
              <div class="sig-title">${isAr ? 'توقيع الموظف' : 'Employee Signature'}</div>
            </div>
            <div class="sig-box">
              <div class="sig-title">${isAr ? 'الموارد البشرية' : 'HR Specialist'}</div>
            </div>
            <div class="sig-box">
              <div class="sig-title">${isAr ? 'اعتماد الإدارة' : 'Management Approval'}</div>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const printLeaveRequest = (leave: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const empName = lang === 'ar' && leave.employee.nameAr ? leave.employee.nameAr : leave.employee.name;
    const isAr = lang === 'ar';
    const direction = isAr ? 'rtl' : 'ltr';
    const leaveTypesAr: any = { Annual: 'سنوية', Sick: 'مرضية', Unpaid: 'بدون راتب', Maternity: 'أمومة/أبوة', Other: 'أخرى' };
    const leaveTypesEn: any = { Annual: 'Annual', Sick: 'Sick', Unpaid: 'Unpaid', Maternity: 'Maternity/Paternity', Other: 'Other' };
    const leaveTypeStr = isAr ? leaveTypesAr[leave.type] : leaveTypesEn[leave.type];
    
    const html = `
      <!DOCTYPE html>
      <html dir="${direction}" lang="${lang}">
      <head>
        <title>${isAr ? 'نموذج طلب إجازة' : 'Leave Request Form'}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; color: #0f172a; margin: 0; padding: 40px; }
          .container { max-width: 800px; margin: 0 auto; border: 2px solid #e2e8f0; border-radius: 12px; padding: 40px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
          .header { text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 28px; color: #1e293b; font-weight: 800; }
          .header p { margin: 5px 0 0; color: #64748b; font-size: 14px; }
          .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
          .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; }
          .info-label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 5px; }
          .info-value { font-size: 16px; font-weight: 700; color: #0f172a; }
          .reason-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 50px; }
          .signatures { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 60px; text-align: center; }
          .sig-box { border-top: 2px dashed #cbd5e1; padding-top: 10px; }
          .sig-title { font-weight: 700; color: #475569; font-size: 14px; }
          @media print {
            body { padding: 0; }
            .container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${isAr ? 'نموذج طلب إجازة' : 'Leave Request Form'}</h1>
            <p>${isAr ? 'تاريخ الطلب:' : 'Request Date:'} ${formatDate(new Date())}</p>
          </div>
          
          <div class="content-grid">
            <div class="info-box">
              <div class="info-label">${isAr ? 'اسم الموظف' : 'Employee Name'}</div>
              <div class="info-value">${empName}</div>
            </div>
            <div class="info-box">
              <div class="info-label">${isAr ? 'الرقم الوظيفي' : 'Employee Code'}</div>
              <div class="info-value">${leave.employee.code}</div>
            </div>
            <div class="info-box">
              <div class="info-label">${isAr ? 'نوع الإجازة' : 'Leave Type'}</div>
              <div class="info-value">${leaveTypeStr || leave.type}</div>
            </div>
            <div class="info-box">
              <div class="info-label">${isAr ? 'حالة الطلب' : 'Status'}</div>
              <div class="info-value">${
                leave.status === 'Approved' ? (isAr ? 'مقبول' : 'Approved') : 
                leave.status === 'Rejected' ? (isAr ? 'مرفوض' : 'Rejected') : 
                (isAr ? 'قيد الانتظار' : 'Pending')
              }</div>
            </div>
            <div class="info-box">
              <div class="info-label">${isAr ? 'تاريخ البداية' : 'Start Date'}</div>
              <div class="info-value">${formatDate(leave.startDate)}</div>
            </div>
            <div class="info-box">
              <div class="info-label">${isAr ? 'تاريخ النهاية' : 'End Date'}</div>
              <div class="info-value">${formatDate(leave.endDate)}</div>
            </div>
          </div>
          
          <div class="reason-box">
            <div class="info-label" style="margin-bottom: 10px;">${isAr ? 'السبب / الملاحظات' : 'Reason / Notes'}</div>
            <div class="info-value" style="font-weight: 500; min-height: 60px;">${leave.reason || (isAr ? 'لا يوجد' : 'None')}</div>
          </div>
          
          <div class="signatures">
            <div class="sig-box">
              <div class="sig-title">${isAr ? 'توقيع الموظف' : 'Employee Signature'}</div>
            </div>
            <div class="sig-box">
              <div class="sig-title">${isAr ? 'مدير الموارد البشرية' : 'HR Manager'}</div>
            </div>
            <div class="sig-box">
              <div class="sig-title">${isAr ? 'المدير المباشر' : 'Direct Manager'}</div>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); window.onafterprint = function() { window.close(); } }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };
  const handleSave = async (data: any) => {
    const res = await createEmployee(data);
    if (!res.success) {
      throw new Error(res.error);
    }
    setEmployees(prev => [data, ...prev]);
    router.refresh();
  };

  const handleUpdateEmployee = async (data: any) => {
    const res = await updateEmployee(editingEmployee.id, data);
    if (!res.success) {
      throw new Error(res.error);
    }
    // Update local state immediately so edits persist in UI
    setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? { ...emp, ...data } : emp));
    setEditingEmployee(null);
    router.refresh();
  };

  const handleSaveMove = async (data: any) => {
    const res = data.id 
      ? await updateFinancialMove(data)
      : await createFinancialMove(data);
    
    if (!res.success) {
      throw new Error(res.error);
    }
    // Update local state immediately with the returned move data
    if (res.move) {
      if (data.id) {
        setMoves(prev => prev.map(m => m.id === data.id ? { ...m, ...res.move } : m));
      } else {
        setMoves(prev => [res.move, ...prev]);
      }
    }
    router.refresh();
  };

  const handleDeleteMove = async (id: string) => {
    if (processingId) return;
    try {
      if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه العملية؟' : 'Are you sure you want to delete this transaction?')) {
        setProcessingId(id);
        // Optimistic update: remove from local state immediately
        setMoves(prev => prev.filter(m => m.id !== id));
        const res = await deleteFinancialMove({ id });
        if (res.success) {
          router.refresh();
        } else {
          window.alert(res.error || 'Failed to delete');
          router.refresh(); // Re-sync to restore if failed
        }
      }
    } catch (err: any) {
      window.alert('Error: ' + err.message);
      router.refresh();
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveMove = async (id: string) => {
    if (processingId) return;
    try {
      if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من اعتماد هذه العملية؟' : 'Are you sure you want to approve this transaction?')) {
        setProcessingId(id);
        const res = await approveFinancialMove({ id });
        if (res.success) {
          setMoves(prev => prev.map(m => m.id === id ? { ...m, status: 'Confirmed' } : m));
          router.refresh();
        } else {
          window.alert(res.error || 'Failed to approve');
        }
      }
    } catch (err: any) {
      window.alert('Error: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSaveLeave = async (data: any) => {
    try {
      setProcessingId('saving-leave');
      const res = data.id 
        ? await updateEmployeeLeave(data)
        : await createEmployeeLeave(data);
      
      if (!res.success) throw new Error(res.error);
      
      if (res.leave) {
        if (data.id) {
          setLeaves(prev => prev.map(l => l.id === data.id ? { ...l, ...res.leave } : l));
        } else {
          setLeaves(prev => [res.leave, ...prev]);
        }
      }
      setShowLeaveModal(false);
      setEditingLeave(null);
      router.refresh();
    } catch (err: any) {
      window.alert('Error: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteLeave = async (id: string) => {
    if (processingId) return;
    try {
      if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الإجازة؟' : 'Are you sure you want to delete this leave?')) {
        setProcessingId(id);
        const res = await deleteEmployeeLeave({ id });
        if (res.success) {
          setLeaves(prev => prev.filter(l => l.id !== id));
          router.refresh();
        } else {
          window.alert(res.error || 'Failed to delete');
        }
      }
    } catch (err: any) {
      window.alert('Error: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateLeaveStatus = async (id: string, status: string) => {
    if (processingId) return;
    try {
      if (window.confirm(lang === 'ar' ? `هل أنت متأكد من تغيير الحالة إلى ${status}؟` : `Change status to ${status}?`)) {
        setProcessingId(id);
        const res = await updateEmployeeLeaveStatus({ id, status });
        if (res.success && res.leave) {
          setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: res.leave.status } : l));
          router.refresh();
        } else {
          window.alert(res.error || 'Failed to update');
        }
      }
    } catch (err: any) {
      window.alert('Error: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleResetDevice = async (empId: string, empName: string) => {
    if (window.confirm(lang === 'ar' 
      ? `هل أنت متأكد من فك ارتباط الهاتف بالموظف (${empName})؟\n\nعند فك الارتباط، سيتمكن الموظف من تسجيل الحضور من هاتفه الجديد وسيتم توثيقه وربطه تلقائياً.` 
      : `Are you sure you want to reset the trusted device binding for (${empName})?`)) {
      try {
        setProcessingId(`reset-dev-${empId}`);
        const res = await resetEmployeeDevice(empId);
        if (res.success) {
          alert(res.message);
          setEmployees(prev => prev.map(e => e.id === empId ? { ...e, deviceId: null, customFields: { ...(e.customFields as any), deviceInfo: null } } : e));
          router.refresh();
        } else {
          alert(res.error || 'فشلت العملية');
        }
      } catch (err: any) {
        alert('Error: ' + err.message);
      } finally {
        setProcessingId(null);
      }
    }
  };

  const filteredEmployees = (employees || []).filter(emp => {
    const term = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(term) ||
      (emp.nameAr && emp.nameAr.includes(term)) ||
      emp.code.toLowerCase().includes(term) ||
      (emp.jobTitle && emp.jobTitle.toLowerCase().includes(term))
    );
  });

  const filteredMoves = (moves || []).filter(move => {
    const term = searchTerm.toLowerCase();
    const empName = (move.employee?.name || '').toLowerCase();
    const empNameAr = (move.employee?.nameAr || '').toLowerCase();
    return empName.includes(term) || empNameAr.includes(term) || (move.reason || '').toLowerCase().includes(term);
  });

  return (
    <div className="page-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="page-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        background: 'var(--glass-bg)',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '2.2rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {lang === 'ar' ? 'شؤون الموظفين' : 'Employee Affairs'}
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>
            {activeTab === 'employees' 
              ? (lang === 'ar' ? 'إدارة بيانات الموظفين' : 'Manage employee records')
              : activeTab === 'attendance'
                ? (lang === 'ar' ? 'متابعة سجل الحضور والانصراف اليومي، البصمة، والحضور الجغرافي' : 'Daily attendance tracking, Biometric & Geofencing')
                : activeTab === 'timesheet'
                  ? (lang === 'ar' ? 'كشف الحضور الشهري وساعات العمل وأيام الدوام والغياب لجميع الموظفين' : 'Monthly attendance timesheet, working hours & days')
                  : activeTab === 'financial'
                    ? (lang === 'ar' ? 'إدارة السلف والجزاءات المالية' : 'Manage financial advances and penalties')
                    : activeTab === 'rewards'
                      ? (lang === 'ar' ? 'إدارة المكافآت والبدلات المالية' : 'Manage financial rewards and allowances')
                      : activeTab === 'leaves'
                        ? (lang === 'ar' ? 'إدارة إجازات الموظفين والموافقات' : 'Manage employee leaves and approvals')
                        : (lang === 'ar' ? 'إدارة قروض الموظفين بالأقساط' : 'Manage employee loans with installments')}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {activeTab === 'employees' ? (
            <button suppressHydrationWarning className="btn btn-primary" onClick={() => setShowModal(true)}>
              {lang === 'ar' ? '+ إضافة موظف جديد' : '+ Add New Employee'}
            </button>
          ) : activeTab === 'attendance' ? (
            <>
              <Link
                href="/employees/punch"
                target="_blank"
                className="btn btn-primary"
                style={{ background: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>📱 {lang === 'ar' ? 'واجهة بصمة الهاتف (GPS)' : 'Mobile Punch UI'}</span>
              </Link>
              <button 
                suppressHydrationWarning 
                className="btn btn-primary" 
                style={{ background: '#0284c7' }} 
                onClick={() => setShowBiometricModal(true)}
              >
                {lang === 'ar' ? '📥 استيراد ملف البصمة' : '📥 Import Biometric'}
              </button>
              <button 
                suppressHydrationWarning 
                className="btn btn-primary" 
                style={{ background: '#10b981' }} 
                onClick={() => { setEditingAttendance(null); setShowAttendanceModal(true); }}
              >
                {lang === 'ar' ? '+ تسجيل حضور يدوي' : '+ Manual Attendance'}
              </button>
            </>
          ) : activeTab === 'timesheet' ? (
            <button 
              suppressHydrationWarning 
              className="btn btn-primary" 
              style={{ background: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }} 
              onClick={() => window.print()}
            >
              <span>🖨️ {lang === 'ar' ? 'طباعة كشف الساعات' : 'Print Timesheet'}</span>
            </button>
          ) : activeTab === 'financial' ? (
            <button suppressHydrationWarning className="btn btn-primary" style={{ background: '#3b82f6' }} onClick={() => setShowMoveModal(true)}>
              {lang === 'ar' ? '+ إضافة سلفة / جزاء' : '+ Add Advance / Penalty'}
            </button>
          ) : activeTab === 'loans' ? (
            <button suppressHydrationWarning className="btn btn-primary" style={{ background: '#6366f1' }} onClick={() => setShowLoanModal(true)}>
              {lang === 'ar' ? '+ قرض جديد' : '+ New Loan'}
            </button>
          ) : activeTab === 'leaves' ? (
            <button suppressHydrationWarning className="btn btn-primary" style={{ background: '#f59e0b' }} onClick={() => { setEditingLeave(null); setShowLeaveModal(true); }}>
              {lang === 'ar' ? '+ طلب إجازة' : '+ Request Leave'}
            </button>
          ) : (
            <button suppressHydrationWarning className="btn btn-primary" style={{ background: '#10b881' }} onClick={() => setShowMoveModal(true)}>
              {lang === 'ar' ? '+ إضافة مكافأة / بدل' : '+ Add Reward / Allowance'}
            </button>
          )}
        </div>
      </div>

      <div className="tabs-container no-print" style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        background: 'rgba(255,255,255,0.03)',
        padding: '0.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '2rem',
        overflowX: 'auto'
      }}>
        <button suppressHydrationWarning
          style={{
            flex: '1',
            padding: '1rem 1.25rem',
            background: activeTab === 'employees' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'employees' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: activeTab === 'employees' ? 'bold' : 'normal',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
          onClick={() => setActiveTab('employees')}
        >
          {lang === 'ar' ? '👥 قائمة الموظفين' : '👥 Employees'}
        </button>
        <button suppressHydrationWarning
          style={{
            flex: '1',
            padding: '1rem 1.25rem',
            background: activeTab === 'attendance' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'attendance' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: activeTab === 'attendance' ? 'bold' : 'normal',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
          onClick={() => setActiveTab('attendance')}
        >
          {lang === 'ar' ? '⏱️ الحضور اليومي' : '⏱️ Daily Attendance'}
        </button>
        <button suppressHydrationWarning
          style={{
            flex: '1',
            padding: '1rem 1.25rem',
            background: activeTab === 'timesheet' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'timesheet' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: activeTab === 'timesheet' ? 'bold' : 'normal',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
          onClick={() => setActiveTab('timesheet')}
        >
          {lang === 'ar' ? '📊 كشف الساعات الشهري' : '📊 Monthly Timesheet'}
        </button>
        <button suppressHydrationWarning
          style={{
            flex: '1',
            padding: '1rem 1.5rem',
            background: activeTab === 'financial' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'financial' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: activeTab === 'financial' ? 'bold' : 'normal',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
          onClick={() => setActiveTab('financial')}
        >
          {lang === 'ar' ? 'السلف والجزاءات' : 'Advances & Penalties'}
        </button>
        <button suppressHydrationWarning
          style={{
            flex: '1',
            padding: '1rem 1.5rem',
            background: activeTab === 'rewards' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'rewards' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: activeTab === 'rewards' ? 'bold' : 'normal',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
          onClick={() => setActiveTab('rewards')}
        >
          {lang === 'ar' ? 'المكافآت والبدلات' : 'Rewards & Allowances'}
        </button>
        <button suppressHydrationWarning
          style={{
            flex: '1',
            padding: '1rem 1.5rem',
            background: activeTab === 'loans' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'loans' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: activeTab === 'loans' ? 'bold' : 'normal',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
          onClick={() => setActiveTab('loans')}
        >
          {lang === 'ar' ? '💳 القروض' : '💳 Loans'}
        </button>
        <button suppressHydrationWarning
          style={{
            flex: '1',
            padding: '1rem 1.5rem',
            background: activeTab === 'leaves' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'leaves' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: activeTab === 'leaves' ? 'bold' : 'normal',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
          onClick={() => setActiveTab('leaves')}
        >
          <span>{lang === 'ar' ? '🏖️ الإجازات' : '🏖️ Leaves'}</span>
          {(leaves || []).filter(l => l.status === 'Pending').length > 0 && (
            <span style={{
              background: '#ef4444',
              color: '#ffffff',
              borderRadius: '20px',
              padding: '2px 8px',
              fontSize: '0.75rem',
              fontWeight: 800,
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)'
            }}>
              {(leaves || []).filter(l => l.status === 'Pending').length} {lang === 'ar' ? 'معلق' : 'pending'}
            </span>
          )}
        </button>
      </div>

      {showModal && (
        <CreateEmployeeModal 
          onClose={() => { setShowModal(false); setEditingEmployee(null); }}
          onSave={editingEmployee ? handleUpdateEmployee : handleSave}
          branches={branches}
          lang={lang}
          initialData={editingEmployee || undefined}
        />
      )}

      {showMoveModal && (
        <CreateFinancialMoveModal 
          onClose={() => {
            setShowMoveModal(false);
            setEditingMove(null);
          }}
          onSave={handleSaveMove}
          employees={initialEmployees}
          lang={lang}
          activeTab={activeTab}
          initialData={editingMove || { type: activeTab === 'rewards' ? 'Reward' : 'AdvanceDeduction' }}
        />
      )}

      {showLoanModal && (
        <LoanModal
          employees={initialEmployees}
          lang={lang}
          onClose={() => setShowLoanModal(false)}
          onSave={() => fetchLoans()}
        />
      )}

      {showLeaveModal && (
        <LeaveModal
          employees={initialEmployees}
          lang={lang}
          leave={editingLeave}
          onClose={() => { setShowLeaveModal(false); setEditingLeave(null); }}
          onSave={handleSaveLeave}
        />
      )}

      {showAttendanceModal && (
        <AttendanceModal
          employees={initialEmployees}
          lang={lang}
          initialData={editingAttendance}
          onClose={() => { setShowAttendanceModal(false); setEditingAttendance(null); }}
          onSuccess={() => fetchAttendances()}
        />
      )}

      {showBiometricModal && (
        <BiometricImportModal
          lang={lang}
          onClose={() => setShowBiometricModal(false)}
          onSuccess={() => fetchAttendances()}
        />
      )}

      <div className={`stats-grid ${activeTab === 'employees' ? 'four-cols' : ''}`}>
        <div className="stat-card">
          <div className="stat-label">
            {lang === 'ar' 
              ? (activeTab === 'employees' ? 'إجمالي الموظفين' : activeTab === 'attendance' ? 'إجمالي الحضور' : activeTab === 'timesheet' ? 'إجمالي الساعات الفعلية' : activeTab === 'financial' ? 'إجمالي السلف' : activeTab === 'loans' ? 'إجمالي القروض' : activeTab === 'leaves' ? 'إجمالي الإجازات' : 'إجمالي المكافآت') 
              : (activeTab === 'employees' ? 'Total Employees' : activeTab === 'attendance' ? 'Total Present' : activeTab === 'timesheet' ? 'Total Actual Hours' : activeTab === 'financial' ? 'Total Advances' : activeTab === 'loans' ? 'Total Loans' : activeTab === 'leaves' ? 'Total Leaves' : 'Total Rewards')}
          </div>
          <div className="stat-value">
            {activeTab === 'employees' 
              ? initialEmployees?.length 
              : activeTab === 'attendance'
                ? attendances?.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length || 0
                : activeTab === 'timesheet'
                  ? timesheetData.reduce((sum, r) => sum + (r.totalActualHours || 0), 0).toFixed(1)
                  : activeTab === 'financial'
                    ? (initialMoves?.filter(m => ['Advance', 'AdvanceDeduction'].includes(m.type)).reduce((s, m) => s + m.amount, 0) || 0).toLocaleString()
                    : activeTab === 'loans'
                      ? (loans?.reduce((s, l) => s + l.totalAmount, 0) || 0).toLocaleString()
                      : activeTab === 'leaves'
                        ? leaves?.length || 0
                        : (initialMoves?.filter(m => ['Reward', 'AdvanceAddition'].includes(m.type)).reduce((s, m) => s + m.amount, 0) || 0).toLocaleString()} 
            {activeTab !== 'employees' && activeTab !== 'leaves' && activeTab !== 'attendance' && activeTab !== 'timesheet' && <span className="currency"> SAR</span>}
            {activeTab === 'timesheet' && <span className="currency"> {lang === 'ar' ? 'ساعة' : 'hrs'}</span>}
          </div>
          <div className="stat-footer positive">{activeTab === 'employees' ? 'Active' : activeTab === 'attendance' ? 'Today' : activeTab === 'timesheet' ? 'الشهر المحدد' : activeTab === 'leaves' ? 'All requests' : 'Current Month'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            {lang === 'ar' 
              ? (activeTab === 'employees' ? 'إجمالي الرواتب' : activeTab === 'attendance' ? 'التأخير' : activeTab === 'timesheet' ? 'إجمالي أيام الحضور' : activeTab === 'financial' ? 'إجمالي الجزاءات' : activeTab === 'loans' ? 'إجمالي الأقساط' : activeTab === 'leaves' ? 'قيد الانتظار' : 'إجمالي البدلات') 
              : (activeTab === 'employees' ? 'Total Salaries' : activeTab === 'attendance' ? 'Late Arrivals' : activeTab === 'timesheet' ? 'Total Present Days' : activeTab === 'financial' ? 'Total Penalties' : activeTab === 'loans' ? 'Total Installments' : activeTab === 'leaves' ? 'Pending' : 'Total Allowances')}
          </div>
          <div className="stat-value">
            {activeTab === 'employees'
              ? (initialEmployees?.reduce((sum, e) => sum + e.basicSalary, 0) || 0).toLocaleString()
              : activeTab === 'attendance'
                ? attendances?.filter(a => a.status === 'LATE').length || 0
                : activeTab === 'timesheet'
                  ? timesheetData.reduce((sum, r) => sum + (r.presentDays || 0), 0)
                  : activeTab === 'financial'
                    ? (initialMoves?.filter(m => m.type === 'Penalty').reduce((s, m) => s + m.amount, 0) || 0).toLocaleString()
                    : activeTab === 'loans'
                      ? (loans?.filter(l => l.status === 'Active').reduce((s, l) => s + l.installmentAmount, 0) || 0).toLocaleString()
                      : activeTab === 'leaves'
                        ? leaves?.filter(l => l.status === 'Pending').length || 0
                        : (initialMoves?.filter(m => m.type === 'Allowance').reduce((s, m) => s + m.amount, 0) || 0).toLocaleString()} 
            {activeTab !== 'leaves' && activeTab !== 'attendance' && activeTab !== 'timesheet' && <span className="currency"> SAR</span>}
            {activeTab === 'timesheet' && <span className="currency"> {lang === 'ar' ? 'يوم' : 'days'}</span>}
          </div>
          <div className="stat-footer">{lang === 'ar' ? (activeTab === 'leaves' ? 'بانتظار الموافقة' : activeTab === 'attendance' ? 'اليوم' : activeTab === 'timesheet' ? 'حضور فعلي' : 'شهرياً') : (activeTab === 'leaves' ? 'Awaiting approval' : 'Monthly')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            {lang === 'ar' 
              ? (activeTab === 'employees' ? 'على رأس العمل' : activeTab === 'attendance' ? 'الغياب / الإجازات' : activeTab === 'timesheet' ? 'إجمالي أيام الغياب' : activeTab === 'loans' ? 'قروض نشطة' : activeTab === 'leaves' ? 'مقبولة' : 'المتوسط العمليات') 
              : (activeTab === 'employees' ? 'On Duty' : activeTab === 'attendance' ? 'Absent / On Leave' : activeTab === 'timesheet' ? 'Total Absent Days' : activeTab === 'loans' ? 'Active Loans' : activeTab === 'leaves' ? 'Approved' : 'Avg per Transaction')}
          </div>
          <div className="stat-value">
            {activeTab === 'employees'
              ? initialEmployees?.filter(e => e.status === 'Active').length
              : activeTab === 'attendance'
                ? attendances?.filter(a => a.status === 'ABSENT' || a.status === 'ON_LEAVE').length || 0
                : activeTab === 'timesheet'
                  ? timesheetData.reduce((sum, r) => sum + (r.absentDays || 0), 0)
                  : activeTab === 'loans'
                    ? loans?.filter(l => l.status === 'Active').length || 0
                    : activeTab === 'leaves'
                      ? leaves?.filter(l => l.status === 'Approved').length || 0
                      : (initialMoves?.filter(m => activeTab === 'financial' ? (['Advance', 'AdvanceDeduction', 'Penalty'].includes(m.type)) : (['Reward', 'Allowance', 'AdvanceAddition'].includes(m.type))).reduce((s, m) => s + m.amount, 0) / 
                         (initialMoves?.filter(m => activeTab === 'financial' ? (['Advance', 'AdvanceDeduction', 'Penalty'].includes(m.type)) : (['Reward', 'Allowance', 'AdvanceAddition'].includes(m.type))).length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            {activeTab === 'timesheet' && <span className="currency"> {lang === 'ar' ? 'يوم' : 'days'}</span>}
          </div>
          <div className="stat-footer text-primary">{activeTab === 'employees' ? 'Stable' : activeTab === 'attendance' ? 'Total' : activeTab === 'timesheet' ? 'بدون عذر' : activeTab === 'loans' ? 'In progress' : activeTab === 'leaves' ? 'Approved leaves' : 'Per record'}</div>
        </div>
        {activeTab === 'employees' && (
          <div className="stat-card">
            <div className="stat-label">
              {lang === 'ar' ? 'في إجازة' : 'On Leave'}
            </div>
            <div className="stat-value">
              {initialEmployees?.filter(e => e.status === 'On Leave' || e.status === 'Leave').length || 0}
            </div>
            <div className="stat-footer text-primary">{lang === 'ar' ? 'حالياً' : 'Currently'}</div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="filter-bar" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {activeTab === 'attendance' ? (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'التاريخ:' : 'Date:'}</span>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={e => setAttendanceDate(e.target.value)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid var(--search-border)', background: 'var(--search-bg)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الموظف:' : 'Employee:'}</span>
                <select
                  value={attendanceFilterEmp}
                  onChange={e => setAttendanceFilterEmp(e.target.value)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid var(--search-border)', background: 'var(--search-bg)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  <option value="ALL">{lang === 'ar' ? 'كل الموظفين' : 'All Employees'}</option>
                  {initialEmployees?.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.code} - {lang === 'ar' && emp.nameAr ? emp.nameAr : emp.name}</option>
                  ))}
                </select>
              </div>

              <div className="search-input-wrapper" style={{ flex: 1, minWidth: '220px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input suppressHydrationWarning
                  type="text" 
                  placeholder={lang === 'ar' ? 'بحث في سجلات الحضور...' : 'Search attendance records...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          ) : activeTab === 'timesheet' ? (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'السنة:' : 'Year:'}</span>
                <select
                  value={timesheetYear}
                  onChange={e => setTimesheetYear(Number(e.target.value))}
                  style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid var(--search-border)', background: 'var(--search-bg)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  {[2024, 2025, 2026, 2027, 2028].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الشهر:' : 'Month:'}</span>
                <select
                  value={timesheetMonth}
                  onChange={e => setTimesheetMonth(Number(e.target.value))}
                  style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid var(--search-border)', background: 'var(--search-bg)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  {[
                    { m: 1, nameAr: 'يناير (01) - 31 يوم', nameEn: 'January (01)' },
                    { m: 2, nameAr: 'فبراير (02) - 28/29 يوم', nameEn: 'February (02)' },
                    { m: 3, nameAr: 'مارس (03) - 31 يوم', nameEn: 'March (03)' },
                    { m: 4, nameAr: 'إبريل (04) - 30 يوم', nameEn: 'April (04)' },
                    { m: 5, nameAr: 'مايو (05) - 31 يوم', nameEn: 'May (05)' },
                    { m: 6, nameAr: 'يونيو (06) - 30 يوم', nameEn: 'June (06)' },
                    { m: 7, nameAr: 'يوليو (07) - 31 يوم', nameEn: 'July (07)' },
                    { m: 8, nameAr: 'أغسطس (08) - 31 يوم', nameEn: 'August (08)' },
                    { m: 9, nameAr: 'سبتمبر (09) - 30 يوم', nameEn: 'September (09)' },
                    { m: 10, nameAr: 'أكتوبر (10) - 31 يوم', nameEn: 'October (10)' },
                    { m: 11, nameAr: 'نوفمبر (11) - 30 يوم', nameEn: 'November (11)' },
                    { m: 12, nameAr: 'ديسمبر (12) - 31 يوم', nameEn: 'December (12)' }
                  ].map(item => (
                    <option key={item.m} value={item.m}>{lang === 'ar' ? item.nameAr : item.nameEn}</option>
                  ))}
                </select>
              </div>

              {timesheetMeta && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#ecfdf5', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #a7f3d0', fontSize: '0.8rem', color: '#065f46', fontWeight: 600 }}>
                  <span>📅 {lang === 'ar' ? `أيام الشهر: ${timesheetMeta.totalDaysInMonth} يوم` : `Days: ${timesheetMeta.totalDaysInMonth}`}</span>
                  <span>•</span>
                  <span>{timesheetMeta.isCurrentMonth ? (lang === 'ar' ? `محسوب حتى اليوم (${timesheetMeta.calculationCutoff})` : `Until day ${timesheetMeta.calculationCutoff}`) : (lang === 'ar' ? 'شهر كامل' : 'Full Month')}</span>
                </div>
              )}

              <div className="search-input-wrapper" style={{ flex: 1, minWidth: '200px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input suppressHydrationWarning
                  type="text" 
                  placeholder={lang === 'ar' ? 'بحث باسم الموظف أو الكود...' : 'Search employee name or code...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="search-input-wrapper" style={{ width: '100%', maxWidth: '480px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input suppressHydrationWarning
                type="text" 
                placeholder={activeTab === 'employees' 
                  ? (lang === 'ar' ? 'بحث عن موظف (الاسم، الكود، الوظيفة)...' : 'Search employee (Name, Code, Title)...')
                  : (lang === 'ar' ? 'بحث عن عملية (الموظف، السبب)...' : 'Search transaction (Employee, Reason)...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="table-container">
          {activeTab === 'attendance' ? (
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
                  <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th>{lang === 'ar' ? 'وقت الحضور' : 'Check-In'}</th>
                  <th>{lang === 'ar' ? 'وقت الانصراف' : 'Check-Out'}</th>
                  <th>{lang === 'ar' ? 'ساعات العمل' : 'Work Duration'}</th>
                  <th>{lang === 'ar' ? 'المصدر' : 'Source'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {attendances.filter(att => {
                  const term = searchTerm.toLowerCase();
                  const empName = (att.employee?.name || '').toLowerCase();
                  const empNameAr = (att.employee?.nameAr || '').toLowerCase();
                  const code = (att.employee?.code || '').toLowerCase();
                  return empName.includes(term) || empNameAr.includes(term) || code.includes(term);
                }).length === 0 ? (
                  <tr>
                    <td colSpan={8} className="empty-state">
                      {lang === 'ar' ? 'لا توجد سجلات حضور مسجلة لهذا اليوم' : 'No attendance records found for this date'}
                    </td>
                  </tr>
                ) : (
                  attendances.filter(att => {
                    const term = searchTerm.toLowerCase();
                    const empName = (att.employee?.name || '').toLowerCase();
                    const empNameAr = (att.employee?.nameAr || '').toLowerCase();
                    const code = (att.employee?.code || '').toLowerCase();
                    return empName.includes(term) || empNameAr.includes(term) || code.includes(term);
                  }).map(att => {
                    const formatTimeOnly = (dt: any) => {
                      if (!dt) return '-';
                      return new Date(dt).toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });
                    };

                    const hours = Math.floor(att.workMinutes / 60);
                    const mins = att.workMinutes % 60;
                    const durationStr = att.workMinutes > 0 ? `${hours} س ${mins} د` : '-';

                    return (
                      <tr key={att.id}>
                        <td>
                          <div className="emp-info">
                            <div className="emp-avatar">
                              {lang === 'ar' && att.employee?.nameAr ? att.employee.nameAr[0] : (att.employee?.name?.[0] || '?')}
                            </div>
                            <div>
                              <div className="emp-name">{lang === 'ar' && att.employee?.nameAr ? att.employee.nameAr : att.employee?.name}</div>
                              <div className="emp-code">{att.employee?.code}</div>
                            </div>
                          </div>
                        </td>
                        <td>{formatDate(att.date)}</td>
                        <td style={{ fontWeight: 600, color: '#16a34a' }}>{formatTimeOnly(att.checkIn)}</td>
                        <td style={{ fontWeight: 600, color: '#dc2626' }}>{formatTimeOnly(att.checkOut)}</td>
                        <td style={{ fontWeight: 700, color: '#0f172a' }}>{durationStr}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <span style={{ fontSize: '0.75rem', padding: '3px 6px', borderRadius: '6px', background: '#f1f5f9', color: '#475569', fontWeight: 600, width: 'fit-content' }}>
                              {att.source === 'MOBILE_GPS' ? '📍 GPS Mobile' : att.source === 'BIOMETRIC' ? '📟 جهاز البصمة' : att.source === 'SYSTEM' ? '🤖 النظام' : '✍️ يدوي'}
                            </span>
                            {att.notes && (
                              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                                {att.notes}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${att.status === 'PRESENT' ? 'active' : att.status === 'LATE' || att.status === 'LATE_PENDING' ? 'penalty' : att.status === 'ABSENT' ? 'penalty' : 'approved'}`} style={{
                            background: att.status === 'PRESENT' ? '#dcfce7' 
                              : (att.status === 'LATE' || att.status === 'LATE_PENDING') ? '#fef3c7' 
                              : att.status === 'ABSENT' ? '#fee2e2' 
                              : att.status === 'NOT_ARRIVED' ? '#f1f5f9'
                              : '#e0e7ff',
                            color: att.status === 'PRESENT' ? '#15803d' 
                              : (att.status === 'LATE' || att.status === 'LATE_PENDING') ? '#b45309' 
                              : att.status === 'ABSENT' ? '#b91c1c' 
                              : att.status === 'NOT_ARRIVED' ? '#64748b'
                              : '#4338ca',
                            fontWeight: 700
                          }}>
                            {att.status === 'PRESENT' ? (lang === 'ar' ? '✅ حاضر' : 'Present') :
                             att.status === 'LATE' ? (lang === 'ar' ? `⚠️ متأخر (${att.lateMinutes || 0} د)` : `Late (${att.lateMinutes || 0}m)`) :
                             att.status === 'LATE_PENDING' ? (lang === 'ar' ? `⚠️ تجاوز الدوام (${att.lateMinutes || 0} د)` : `Overdue (${att.lateMinutes || 0}m)`) :
                             att.status === 'ABSENT' ? (lang === 'ar' ? '❌ غائب (تجاوز ساعة)' : 'Absent (>1h)') :
                             att.status === 'NOT_ARRIVED' ? (lang === 'ar' ? '⏳ لم يحضر بعد' : 'Not Arrived') :
                             att.status === 'ON_LEAVE' ? (lang === 'ar' ? '🏖️ إجازة' : 'On Leave') :
                             att.status === 'WEEKEND' ? (lang === 'ar' ? '🌴 عطلة أسبوعية' : 'Weekend') : att.status}
                          </span>
                        </td>
                        <td>
                          <div className="actions">
                            <span 
                              className="icon-btn" 
                              style={{ color: '#3b82f6', cursor: 'pointer' }}
                              onClick={() => {
                                setEditingAttendance(att.isVirtual ? { employeeId: att.employeeId, date: att.date, employee: att.employee } : att);
                                setShowAttendanceModal(true);
                              }}
                              title={lang === 'ar' ? (att.isVirtual ? 'تسجيل يدوي' : 'تعديل') : (att.isVirtual ? 'Manual Punch' : 'Edit')}
                            >
                              {att.isVirtual ? '➕' : '✏️'}
                            </span>
                            {!att.isVirtual && (
                              <span 
                                className="icon-btn" 
                                style={{ color: '#ef4444', cursor: 'pointer' }}
                                onClick={async () => {
                                  if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف حركة الحضور هذه؟' : 'Delete this attendance record?')) {
                                    await deleteAttendance(att.id);
                                    fetchAttendances();
                                  }
                                }}
                                title={lang === 'ar' ? 'حذف' : 'Delete'}
                              >
                                🗑️
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : activeTab === 'timesheet' ? (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
                    <th>{lang === 'ar' ? 'الوردية اليومية' : 'Daily Shift'}</th>
                    <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'أيام الدوام المتوقعة' : 'Exp. Work Days'}</th>
                    <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'ساعات العمل المتوقعة' : 'Exp. Hours'}</th>
                    <th style={{ textAlign: 'center', color: '#16a34a' }}>{lang === 'ar' ? 'أيام الحضور' : 'Present Days'}</th>
                    <th style={{ textAlign: 'center', color: '#2563eb' }}>{lang === 'ar' ? 'الساعات الفعلية' : 'Actual Hours'}</th>
                    <th style={{ textAlign: 'center', color: '#d97706' }}>{lang === 'ar' ? 'أيام التأخير' : 'Late Days'}</th>
                    <th style={{ textAlign: 'center', color: '#dc2626' }}>{lang === 'ar' ? 'أيام الغياب' : 'Absent Days'}</th>
                    <th style={{ textAlign: 'center', color: '#7c3aed' }}>{lang === 'ar' ? 'إجازات معتمدة' : 'Leaves'}</th>
                    <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'عطلات أسبوعية' : 'Weekends'}</th>
                    <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'نسبة الالتزام' : 'Attendance Rate'}</th>
                    <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'طباعة الكشف' : 'Print'}</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingTimesheet ? (
                    <tr>
                      <td colSpan={12} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.2rem' }}>⏳</span>
                          <span>{lang === 'ar' ? 'جاري تجميع بيانات الحضور وحساب ساعات الشهر...' : 'Calculating monthly hours and attendance...'}</span>
                        </div>
                      </td>
                    </tr>
                  ) : timesheetData.filter(row => {
                    const term = searchTerm.toLowerCase();
                    const empName = (row.name || '').toLowerCase();
                    const empNameAr = (row.nameAr || '').toLowerCase();
                    const code = (row.code || '').toLowerCase();
                    return empName.includes(term) || empNameAr.includes(term) || code.includes(term);
                  }).length === 0 ? (
                    <tr>
                      <td colSpan={12} className="empty-state">
                        {lang === 'ar' ? 'لا توجد بيانات حضور مسجلة لهذا الشهر' : 'No attendance data for this month'}
                      </td>
                    </tr>
                  ) : (
                    timesheetData.filter(row => {
                      const term = searchTerm.toLowerCase();
                      const empName = (row.name || '').toLowerCase();
                      const empNameAr = (row.nameAr || '').toLowerCase();
                      const code = (row.code || '').toLowerCase();
                      return empName.includes(term) || empNameAr.includes(term) || code.includes(term);
                    }).map(row => {
                      const totalLateMins = (row.totalLateMinutes || 0) + (row.totalEarlyMinutes || 0);
                      const lateHours = Math.floor(totalLateMins / 60);
                      const lateM = totalLateMins % 60;
                      const lateTimeStr = totalLateMins > 0 ? `${lateHours > 0 ? `${lateHours}س ` : ''}${lateM}د` : '0د';

                      // Attendance rate calculation
                      const rate = row.expectedWorkDays > 0 
                        ? Math.min(100, Math.round((row.presentDays / row.expectedWorkDays) * 100))
                        : 100;

                      return (
                        <tr key={row.employeeId}>
                          <td>
                            <div className="emp-info">
                              <div className="emp-avatar">
                                {lang === 'ar' && row.nameAr ? row.nameAr[0] : (row.name?.[0] || '?')}
                              </div>
                              <div>
                                <div className="emp-name">{lang === 'ar' && row.nameAr ? row.nameAr : row.name}</div>
                                <div className="emp-code">{row.code} • {row.department || '-'}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                              {row.shiftStart} - {row.shiftEnd}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {row.workHoursPerDay} {lang === 'ar' ? 'ساعات/يوم' : 'hrs/day'}
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>
                            {row.expectedWorkDays} {lang === 'ar' ? 'يوم' : 'd'}
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                            {row.expectedTotalHours} {lang === 'ar' ? 'ساعة' : 'h'}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                              {row.presentDays} {lang === 'ar' ? 'يوم' : 'd'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                              {row.totalActualHours} {lang === 'ar' ? 'ساعة' : 'h'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {row.lateDays > 0 ? (
                              <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }} title={lateTimeStr}>
                                {row.lateDays} ي ({lateTimeStr})
                              </span>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>0</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {row.absentDays > 0 ? (
                              <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                                {row.absentDays} {lang === 'ar' ? 'يوم' : 'd'}
                              </span>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>0</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {row.approvedLeaveDays > 0 ? (
                              <span style={{ background: '#f3e8ff', color: '#7e22ce', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                                {row.approvedLeaveDays} {lang === 'ar' ? 'يوم' : 'd'}
                              </span>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>0</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                            {row.weekendDaysCount} {lang === 'ar' ? 'يوم' : 'd'}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: rate >= 90 ? '#16a34a' : rate >= 75 ? '#d97706' : '#dc2626' }}>
                                {rate}%
                              </span>
                              <div style={{ width: '45px', height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${rate}%`, height: '100%', background: rate >= 90 ? '#16a34a' : rate >= 75 ? '#d97706' : '#dc2626' }} />
                              </div>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => printEmployeeTimesheet(row)}
                              className="icon-btn"
                              style={{ 
                                background: '#f8fafc', 
                                border: '1px solid #cbd5e1', 
                                borderRadius: '8px', 
                                padding: '6px 12px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: '#1e293b',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title={lang === 'ar' ? 'طباعة كشف ساعات هذا الموظف' : 'Print Employee Timesheet'}
                            >
                              <span>🖨️</span>
                              <span>{lang === 'ar' ? 'طباعة' : 'Print'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'employees' ? (
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
                  <th>{lang === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}</th>
                  <th>{lang === 'ar' ? 'الهاتف المعتمد 📱' : 'Trusted Device 📱'}</th>
                  <th>{lang === 'ar' ? 'تاريخ الانضمام' : 'Join Date'}</th>
                  <th>{lang === 'ar' ? 'الراتب الأساسي' : 'Basic Salary'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      {lang === 'ar' ? 'لا يوجد موظفين حالياً' : 'No employees found'}
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map(emp => (
                    <tr key={emp.id}>
                      <td>
                        <div className="emp-info">
                          <div className="emp-avatar">
                            {emp.photoUrl 
                              ? <img src={emp.photoUrl} alt={emp.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                              : (lang === 'ar' && emp.nameAr ? emp.nameAr[0] : emp.name[0])}
                          </div>
                          <div>
                            <div className="emp-name">{lang === 'ar' && emp.nameAr ? emp.nameAr : emp.name}</div>
                            <div className="emp-code">{emp.code}</div>
                          </div>
                        </div>
                      </td>
                      <td>{lang === 'ar' && emp.jobTitleAr ? emp.jobTitleAr : emp.jobTitle}</td>
                      <td>
                        {emp.deviceId ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ 
                              fontSize: '0.73rem', 
                              padding: '3px 8px', 
                              borderRadius: '8px', 
                              background: '#ecfdf5', 
                              color: '#065f46', 
                              border: '1px solid #a7f3d0', 
                              fontWeight: 700, 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '4px' 
                            }}>
                              <span>🔒</span>
                              <span>{(emp.customFields as any)?.deviceInfo || 'هاتف موثق'}</span>
                            </span>
                            <button 
                              onClick={() => handleResetDevice(emp.id, lang === 'ar' && emp.nameAr ? emp.nameAr : emp.name)}
                              disabled={processingId === `reset-dev-${emp.id}`}
                              style={{ 
                                background: '#fee2e2', 
                                border: '1px solid #fca5a5', 
                                borderRadius: '6px',
                                cursor: 'pointer', 
                                fontSize: '0.75rem',
                                color: '#dc2626',
                                padding: '3px 6px',
                                fontWeight: 700
                              }}
                              title={lang === 'ar' ? 'فك ارتباط الهاتف للسماح بهاتف جديد' : 'Reset Device Binding'}
                            >
                              {processingId === `reset-dev-${emp.id}` ? '⏳' : (lang === 'ar' ? 'فك 🔄' : 'Reset')}
                            </button>
                          </div>
                        ) : (
                          <span style={{ 
                            fontSize: '0.72rem', 
                            padding: '3px 8px', 
                            borderRadius: '8px', 
                            background: 'var(--chip-bg)', 
                            color: 'var(--text-secondary)', 
                            border: '1px solid var(--glass-border)', 
                            fontWeight: 600 
                          }}>
                            🔓 {lang === 'ar' ? 'غير مقيد (ربط تلقائي)' : 'Auto-bind on punch'}
                          </span>
                        )}
                      </td>
                      <td>{formatDate(emp.joinDate)}</td>
                      <td className="salary">{(emp.basicSalary || 0).toLocaleString()} SAR</td>
                      <td>
                        <span className={`status-badge ${emp.status?.toLowerCase()}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <Link href={`/employees/${emp.id}`} className="icon-btn" title={lang === 'ar' ? 'الملف الشخصي' : 'Profile'} style={{ textDecoration: 'none' }}>👤</Link>
                          <button suppressHydrationWarning className="icon-btn" title={lang === 'ar' ? 'تعديل' : 'Edit'} onClick={() => { setEditingEmployee(emp); setShowModal(true); }}>✏️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : activeTab === 'loans' ? (
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
                  <th>{lang === 'ar' ? 'مبلغ القرض' : 'Loan Amount'}</th>
                  <th>{lang === 'ar' ? 'القسط الشهري' : 'Monthly Installment'}</th>
                  <th>{lang === 'ar' ? 'المتبقي' : 'Remaining'}</th>
                  <th>{lang === 'ar' ? 'بداية الخصم' : 'Start'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {loans.length === 0 ? (
                  <tr><td colSpan={6} className="empty-state">{lang === 'ar' ? 'لا توجد قروض حالياً' : 'No loans found'}</td></tr>
                ) : (
                  loans.map((loan: any) => (
                    <tr key={loan.id}>
                      <td>
                        <div className="emp-info">
                          <div className="emp-avatar">{loan.employee?.name?.[0] || '?'}</div>
                          <div>
                            <div className="emp-name">{lang === 'ar' && loan.employee?.nameAr ? loan.employee.nameAr : loan.employee?.name}</div>
                            <div className="emp-code">{loan.employee?.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="salary">{loan.totalAmount?.toLocaleString()} SAR</td>
                      <td>{loan.installmentAmount?.toLocaleString()} SAR</td>
                      <td style={{ fontWeight: 700, color: loan.remainingAmount > 0 ? '#ef4444' : '#10b981' }}>
                        {loan.remainingAmount?.toLocaleString()} SAR
                      </td>
                      <td>{loan.startMonth}/{loan.startYear}</td>
                      <td>
                        <span className={`status-badge ${loan.status === 'Active' ? 'active' : 'approved'}`}>
                          {loan.status === 'Active' ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'مسدد' : 'Settled')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : activeTab === 'leaves' ? (
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
                  <th>{lang === 'ar' ? 'نوع الإجازة' : 'Leave Type'}</th>
                  <th>{lang === 'ar' ? 'من تاريخ' : 'Start Date'}</th>
                  <th>{lang === 'ar' ? 'إلى تاريخ' : 'End Date'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr><td colSpan={6} className="empty-state">{lang === 'ar' ? 'لا توجد طلبات إجازات' : 'No leave requests found'}</td></tr>
                ) : (
                  leaves.map((leave: any) => (
                    <tr key={leave.id}>
                      <td>
                        <div className="emp-info">
                          <div className="emp-avatar">{leave.employee?.name?.[0] || '?'}</div>
                          <div>
                            <div className="emp-name">{lang === 'ar' && leave.employee?.nameAr ? leave.employee.nameAr : leave.employee?.name}</div>
                            <div className="emp-code">{leave.employee?.code}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ 
                          background: leave.type === 'Permission' ? 'rgba(168, 85, 247, 0.1)' : leave.type === 'Emergency' ? 'rgba(245, 158, 11, 0.15)' : leave.type === 'Sick' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(59, 130, 246, 0.1)', 
                          color: leave.type === 'Permission' ? '#9333ea' : leave.type === 'Emergency' ? '#d97706' : leave.type === 'Sick' ? '#ef4444' : '#3b82f6', 
                          border: `1px solid ${leave.type === 'Permission' ? 'rgba(168, 85, 247, 0.2)' : leave.type === 'Emergency' ? 'rgba(245, 158, 11, 0.3)' : leave.type === 'Sick' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(59, 130, 246, 0.2)'}`,
                          fontWeight: 700
                        }}>
                          {leave.type === 'Permission' ? (lang === 'ar' ? '🕒 استئذان' : 'Permission') :
                           leave.type === 'EarlyDeparture' ? (lang === 'ar' ? '🚪 خروج مبكر' : 'Early Departure') :
                           leave.type === 'LateArrival' ? (lang === 'ar' ? '⏳ تأخر مبرر' : 'Late Arrival') :
                           leave.type === 'Annual' ? (lang === 'ar' ? '🏖️ سنوية' : 'Annual') :
                           leave.type === 'Sick' ? (lang === 'ar' ? '🤒 مرضية' : 'Sick') :
                           leave.type === 'Emergency' ? (lang === 'ar' ? '🚨 طارئة' : 'Emergency') :
                           leave.type === 'Maternity' ? (lang === 'ar' ? '🍼 أمومة / رعاية' : 'Maternity') :
                           leave.type === 'Unpaid' ? (lang === 'ar' ? 'بدون راتب' : 'Unpaid') :
                           leave.type}
                        </span>
                      </td>
                      <td>{formatDate(leave.startDate)}</td>
                      <td>{formatDate(leave.endDate)}</td>
                      <td>
                        <span className={`status-badge ${leave.status === 'Approved' ? 'approved' : leave.status === 'Rejected' ? 'active' : 'pending'}`} style={
                          leave.status === 'Approved' ? { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'transparent' } :
                          leave.status === 'Rejected' ? { background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderColor: 'transparent' } :
                          { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', borderColor: 'transparent' }
                        }>
                          {leave.status === 'Approved' ? (lang === 'ar' ? 'مقبول' : 'Approved') :
                           leave.status === 'Rejected' ? (lang === 'ar' ? 'مرفوض' : 'Rejected') :
                           (lang === 'ar' ? 'قيد الانتظار' : 'Pending')}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          {processingId === leave.id ? (
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>...</span>
                          ) : (
                            <>
                              {leave.status === 'Pending' && (
                                <>
                                  <span className="icon-btn" style={{ color: '#10b881', borderColor: '#10b88122', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleUpdateLeaveStatus(leave.id, 'Approved'); }} title={lang === 'ar' ? 'قبول' : 'Approve'}>✅</span>
                                  <span className="icon-btn" style={{ color: '#ef4444', borderColor: '#ef444422', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleUpdateLeaveStatus(leave.id, 'Rejected'); }} title={lang === 'ar' ? 'رفض' : 'Reject'}>❌</span>
                                </>
                              )}
                              <span className="icon-btn" style={{ color: '#6366f1', borderColor: '#6366f122', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); printLeaveRequest(leave); }} title={lang === 'ar' ? 'طباعة' : 'Print'}>🖨️</span>
                              <span className="icon-btn" style={{ color: '#3b82f6', borderColor: '#3b82f622', cursor: 'pointer' }} onClick={() => { setEditingLeave(leave); setShowLeaveModal(true); }} title={lang === 'ar' ? 'تعديل' : 'Edit'}>✏️</span>
                              <span className="icon-btn" style={{ color: '#ef4444', borderColor: '#ef444422', cursor: 'pointer' }} onClick={() => handleDeleteLeave(leave.id)} title={lang === 'ar' ? 'حذف' : 'Delete'}>🗑️</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
                  <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th>{lang === 'ar' ? 'النوع' : 'Type'}</th>
                  <th>{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                  <th>{lang === 'ar' ? 'الحالة / الإجراء' : 'Status / Procedure'}</th>
                  <th>{lang === 'ar' ? 'البيان / السبب' : 'Reason'}</th>
                  <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredMoves.filter(m => activeTab === 'rewards' 
                    ? (['Reward', 'Allowance', 'AdvanceAddition'].includes(m.type)) 
                    : (['Advance', 'AdvanceDeduction', 'Penalty'].includes(m.type))
                  ).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      {lang === 'ar' ? 'لا توجد عمليات' : 'No transactions found'}
                    </td>
                  </tr>
                ) : (
                  filteredMoves.filter(m => activeTab === 'rewards' ? (['Reward', 'Allowance', 'AdvanceAddition'].includes(m.type)) : (['Advance', 'AdvanceDeduction', 'Penalty'].includes(m.type))).map(move => (
                    <tr key={move.id}>
                      <td>
                        <div className="emp-name">{lang === 'ar' && move.employee.nameAr ? move.employee.nameAr : move.employee.name}</div>
                        <div className="emp-code">{move.employee.code}</div>
                      </td>
                      <td>{formatDate(move.date)}</td>
                      <td>
                        <span className={`status-badge ${move.type.toLowerCase()}`}>
                          {move.type === 'AdvanceDeduction' || move.type === 'Advance' ? (lang === 'ar' ? 'سداد سلفة' : 'Advance Repayment') : 
                           move.type === 'AdvanceAddition' ? (lang === 'ar' ? 'صرف سلفة مقدمة' : 'Advance Payment') :
                           move.type === 'Penalty' ? (lang === 'ar' ? 'جزاء' : 'Penalty') :
                           move.type === 'Reward' ? (lang === 'ar' ? 'مكافأة' : 'Reward') :
                           (lang === 'ar' ? 'بدل' : 'Allowance')}
                        </span>
                      </td>
                      <td className="salary">{move.amount.toLocaleString()} SAR</td>
                      <td>
                        <span className={`status-badge ${move.status.toLowerCase()}`}>
                          {move.status === 'Confirmed' ? (lang === 'ar' ? 'معتمد' : 'Confirmed') : (lang === 'ar' ? 'قيد الانتظار' : 'Pending')}
                        </span>
                      </td>
                      <td className="text-sub">{move.reason || '—'}</td>
                      <td>
                        <div className="actions">
                          {processingId === move.id ? (
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>...</span>
                          ) : (
                            <>
                              {move.status !== 'Confirmed' && (
                                <span 
                                  className="icon-btn" 
                                  style={{ color: '#10b881', borderColor: '#10b88122', cursor: 'pointer' }} 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleApproveMove(move.id);
                                  }}
                                  title={lang === 'ar' ? 'اعتماد' : 'Approve'}
                                >
                                  ✅
                                </span>
                              )}
                              <span 
                                className="icon-btn" 
                                style={{ color: '#3b82f6', borderColor: '#3b82f622', cursor: 'pointer' }} 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setEditingMove(move);
                                  setShowMoveModal(true);
                                }}
                                title={lang === 'ar' ? 'تعديل' : 'Edit'}
                              >
                                ✏️
                              </span>
                              <span 
                                className="icon-btn" 
                                style={{ color: '#ef4444', borderColor: '#ef444422', cursor: 'pointer' }} 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteMove(move.id);
                                }}
                                title={lang === 'ar' ? 'حذف' : 'Delete'}
                              >
                                🗑️
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style jsx>{`
        .employees-page { padding: 2rem; max-width: 1400px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1.5rem; }
        .page-title { 
          font-size: 2.25rem; 
          font-weight: 900; 
          background: var(--title-gradient);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: var(--text-primary); 
          margin-bottom: 0.5rem; 
          letter-spacing: -0.025em; 
        }
        .page-subtitle { color: var(--text-secondary); font-size: 1rem; font-weight: 500; }
        
        .tab-switcher { 
          display: flex; 
          background: var(--chip-bg); 
          padding: 6px; 
          border-radius: 14px; 
          border: 1px solid var(--glass-border); 
          backdrop-filter: blur(12px);
          height: fit-content; 
        }
        .tab-btn { 
          padding: 0.75rem 1.5rem; 
          border: none; 
          background: transparent; 
          border-radius: 10px; 
          font-size: 0.9rem; 
          font-weight: 700; 
          color: var(--text-secondary); 
          cursor: pointer; 
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .tab-btn.active { 
          background: var(--accent-primary); 
          color: #ffffff; 
          box-shadow: 0 4px 14px rgba(var(--accent-primary-rgb, 37, 99, 235), 0.35); 
        }
        .tab-btn:hover:not(.active) { 
          color: var(--text-primary); 
          background: var(--glass-hover); 
        }

        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
        .stats-grid.four-cols { grid-template-columns: repeat(4, 1fr); }
        .stat-card { 
          background: var(--card-bg); 
          padding: 1.75rem 2rem; 
          border-radius: 20px; 
          border: 1px solid var(--glass-border); 
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25); 
          transition: all 0.25s ease; 
        }
        .stat-card:hover { 
          transform: translateY(-3px); 
          border-color: var(--accent-primary);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35); 
        }
        .stat-label { 
          font-size: 0.85rem; 
          color: var(--text-secondary); 
          font-weight: 700; 
          text-transform: uppercase; 
          margin-bottom: 0.75rem; 
          letter-spacing: 0.05em; 
        }
        .stat-value { 
          font-size: 2rem; 
          font-weight: 900; 
          color: var(--text-primary); 
          margin-bottom: 0.5rem; 
        }
        .currency { font-size: 1rem; font-weight: 600; color: var(--text-secondary); }
        .stat-footer { font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 4px; color: var(--text-secondary); }
        .stat-footer.positive { color: #10b981; }
        .stat-footer.positive::before { content: '●'; font-size: 0.6rem; }
        
        .card { 
          background: var(--card-bg); 
          border-radius: 20px; 
          border: 1px solid var(--glass-border); 
          backdrop-filter: blur(16px);
          overflow: hidden; 
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3); 
        }
        .filter-bar { 
          padding: 1.25rem 2rem; 
          border-bottom: 1px solid var(--glass-border); 
          background: var(--glass-bg); 
          display: flex; 
          align-items: center; 
        }
        .search-input-wrapper { position: relative; width: 100%; max-width: 480px; }
        .search-input-wrapper svg { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: var(--text-secondary); }
        .search-input-wrapper input { 
          width: 100%; 
          padding: 0.875rem 1rem 0.875rem 3.25rem; 
          border-radius: 12px; 
          border: 1px solid var(--search-border); 
          font-size: 0.95rem; 
          background: var(--search-bg); 
          color: var(--text-primary);
          transition: all 0.2s; 
        }
        .search-input-wrapper input:focus { 
          outline: none; 
          border-color: var(--accent-primary); 
          background: var(--search-bg); 
          box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb, 37, 99, 235), 0.2); 
        }
        
        [dir="rtl"] .search-input-wrapper svg { left: auto; right: 1.25rem; }
        [dir="rtl"] .search-input-wrapper input { padding: 0.875rem 3.25rem 0.875rem 1rem; }

        .table-container { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { 
          padding: 1.25rem 1rem; 
          text-align: center; 
          font-size: 0.8rem; 
          font-weight: 800; 
          color: var(--text-secondary); 
          text-transform: uppercase; 
          border-bottom: 1px solid var(--glass-border); 
          background: var(--glass-bg); 
        }
        [dir="rtl"] th { text-align: center; }
        td { 
          padding: 1.25rem 1rem; 
          border-bottom: 1px solid var(--glass-border); 
          font-size: 0.95rem; 
          color: var(--text-primary); 
          text-align: center; 
          transition: background 0.2s ease, color 0.2s ease;
        }
        tr:hover td { 
          background: var(--glass-hover, rgba(56, 189, 248, 0.08)) !important; 
          color: var(--text-primary) !important;
        }
        
        .emp-info { display: flex; align-items: center; justify-content: center; gap: 1.25rem; }
        .emp-avatar { 
          width: 44px; 
          height: 44px; 
          border-radius: 12px; 
          background: linear-gradient(135deg, rgba(var(--accent-primary-rgb, 37, 99, 235), 0.15), rgba(var(--accent-primary-rgb, 37, 99, 235), 0.3)); 
          color: var(--accent-primary); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: 800; 
          font-size: 1.25rem; 
          border: 1px solid var(--glass-border); 
        }
        .emp-name { font-weight: 800; color: var(--text-primary); }
        .emp-code { font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; }
        
        .salary { font-weight: 800; color: #10b981; }
        .status-badge { padding: 0.35rem 1rem; border-radius: 30px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.025em; }
        .status-badge.active { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.25); }
        .status-badge.advance { background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.25); }
        .status-badge.penalty { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.25); }
        .status-badge.reward { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.25); }
        .status-badge.allowance { background: rgba(168, 85, 247, 0.15); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.25); }
        .status-badge.approved { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.25); }
        .status-badge.pending { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.25); }
        
        .actions { display: flex; gap: 0.75rem; justify-content: center; }
        .icon-btn { 
          border: 1px solid var(--glass-border); 
          background: var(--chip-bg); 
          padding: 0.5rem; 
          border-radius: 10px; 
          cursor: pointer; 
          transition: all 0.2s; 
          color: var(--text-secondary); 
        }
        .icon-btn:hover { 
          border-color: var(--accent-primary); 
          color: var(--accent-primary); 
          background: var(--glass-hover); 
        }
        
        .empty-state { text-align: center; padding: 6rem; color: var(--text-secondary); font-weight: 600; }
        .btn-primary { 
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary, var(--accent-primary))); 
          color: white; 
          border: none; 
          padding: 0.875rem 2rem; 
          border-radius: 12px; 
          font-weight: 800; 
          cursor: pointer; 
          transition: all 0.2s; 
          box-shadow: 0 4px 14px rgba(var(--accent-primary-rgb, 37, 99, 235), 0.35); 
        }
        .btn-primary:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 6px 20px rgba(var(--accent-primary-rgb, 37, 99, 235), 0.5); 
        }

        .modal-overlay { 
          position: fixed; 
          top: 0; left: 0; right: 0; bottom: 0; 
          background: rgba(0, 0, 0, 0.7); 
          z-index: 1000; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          backdrop-filter: blur(12px); 
        }
        .modal-content { 
          background: var(--card-bg, #0f172a); 
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          border-radius: 24px; 
          width: 100%; 
          padding: 2.5rem; 
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); 
        }
        .modal-actions { 
          display: flex; 
          justify-content: flex-end; 
          gap: 1rem; 
          padding-top: 1.5rem; 
          border-top: 1px solid var(--glass-border); 
        }
        .btn-secondary { 
          background: var(--chip-bg); 
          border: 1px solid var(--glass-border); 
          padding: 0.875rem 2rem; 
          border-radius: 12px; 
          cursor: pointer; 
          font-weight: 800; 
          color: var(--text-primary); 
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: var(--glass-hover);
          border-color: var(--accent-primary);
        }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr; }
          .page-header { flex-direction: column; align-items: flex-start; }
          .tab-switcher { width: 100%; justify-content: space-between; }
        }
      `}</style>
    </div>
  );
}
