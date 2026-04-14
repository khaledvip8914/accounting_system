'use client';

import React, { useState } from 'react';
import CreateEmployeeModal from './CreateEmployeeModal';
import CreateFinancialMoveModal from './CreateFinancialMoveModal';
import { createEmployee, createFinancialMove, deleteFinancialMove, approveFinancialMove, updateFinancialMove } from './actions';

export default function EmployeesClient({ initialEmployees, initialMoves, lang, dict }: { initialEmployees: any[], initialMoves: any[], lang: string, dict: any }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [editingMove, setEditingMove] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'employees' | 'financial' | 'rewards'>('employees');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (date: any) => {
    if (!mounted) return new Date(date).toISOString().split('T')[0];
    return new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US');
  };
  const handleSave = async (data: any) => {
    const res = await createEmployee(data);
    if (!res.success) {
      throw new Error(res.error);
    }
  };

  const handleSaveMove = async (data: any) => {
    const res = data.id 
      ? await updateFinancialMove(data)
      : await createFinancialMove(data);
    
    if (!res.success) {
      throw new Error(res.error);
    }
  };

  const handleDeleteMove = async (id: string) => {
    if (processingId) return;
    try {
      if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه العملية؟' : 'Are you sure you want to delete this transaction?')) {
        setProcessingId(id);
        const res = await deleteFinancialMove({ id });
        if (res.success) {
          // Success
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

  const handleApproveMove = async (id: string) => {
    if (processingId) return;
    try {
      if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من اعتماد هذه العملية؟' : 'Are you sure you want to approve this transaction?')) {
        setProcessingId(id);
        const res = await approveFinancialMove({ id });
        if (res.success) {
          // Success
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

  const filteredEmployees = (initialEmployees || []).filter(emp => {
    const term = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(term) ||
      (emp.nameAr && emp.nameAr.includes(term)) ||
      emp.code.toLowerCase().includes(term) ||
      (emp.jobTitle && emp.jobTitle.toLowerCase().includes(term))
    );
  });

  const filteredMoves = (initialMoves || []).filter(move => {
    const term = searchTerm.toLowerCase();
    const empName = (move.employee?.name || '').toLowerCase();
    const empNameAr = (move.employee?.nameAr || '').toLowerCase();
    return empName.includes(term) || empNameAr.includes(term) || (move.reason || '').toLowerCase().includes(term);
  });

  return (
    <div className="employees-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'ar' ? 'شؤون الموظفين' : 'Employee Affairs'}</h1>
          <p className="page-subtitle">
            {activeTab === 'employees' 
              ? (lang === 'ar' ? 'إدارة بيانات الموظفين' : 'Manage employee records')
              : activeTab === 'financial'
                ? (lang === 'ar' ? 'إدارة السلف والجزاءات المالية' : 'Manage financial advances and penalties')
                : (lang === 'ar' ? 'إدارة المكافآت والبدلات المالية' : 'Manage financial rewards and allowances')}
          </p>
        </div>
        
        <div className="tab-switcher">
          <button 
            className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            {lang === 'ar' ? 'قائمة الموظفين' : 'Employee List'}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'financial' ? 'active' : ''}`}
            onClick={() => setActiveTab('financial')}
          >
            {lang === 'ar' ? 'السلف والجزاءات' : 'Advances & Penalties'}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'rewards' ? 'active' : ''}`}
            onClick={() => setActiveTab('rewards')}
          >
            {lang === 'ar' ? 'المكافآت والبدلات' : 'Rewards & Allowances'}
          </button>
        </div>

        {activeTab === 'employees' ? (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            {lang === 'ar' ? '+ إضافة موظف جديد' : '+ Add New Employee'}
          </button>
        ) : activeTab === 'financial' ? (
          <button className="btn-primary" style={{ background: '#3b82f6' }} onClick={() => setShowMoveModal(true)}>
            {lang === 'ar' ? '+ إضافة سلفة / جزاء' : '+ Add Advance / Penalty'}
          </button>
        ) : (
          <button className="btn-primary" style={{ background: '#10b881' }} onClick={() => setShowMoveModal(true)}>
            {lang === 'ar' ? '+ إضافة مكافأة / بدل' : '+ Add Reward / Allowance'}
          </button>
        )}
      </div>

      {showModal && (
        <CreateEmployeeModal 
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          lang={lang}
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
          initialData={editingMove || { type: activeTab === 'rewards' ? 'Reward' : 'Advance' }}
        />
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">
            {lang === 'ar' 
              ? (activeTab === 'employees' ? 'إجمالي الموظفين' : activeTab === 'financial' ? 'إجمالي السلف' : 'إجمالي المكافآت') 
              : (activeTab === 'employees' ? 'Total Employees' : activeTab === 'financial' ? 'Total Advances' : 'Total Rewards')}
          </div>
          <div className="stat-value">
            {activeTab === 'employees' 
              ? initialEmployees?.length 
              : activeTab === 'financial'
                ? (initialMoves?.filter(m => ['Advance', 'AdvanceDeduction'].includes(m.type)).reduce((s, m) => s + m.amount, 0) || 0).toLocaleString()
                : (initialMoves?.filter(m => ['Reward', 'AdvanceAddition'].includes(m.type)).reduce((s, m) => s + m.amount, 0) || 0).toLocaleString()} 
            {activeTab !== 'employees' && <span className="currency"> SAR</span>}
          </div>
          <div className="stat-footer positive">{activeTab === 'employees' ? 'Active' : 'Current Month'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            {lang === 'ar' 
              ? (activeTab === 'employees' ? 'إجمالي الرواتب' : activeTab === 'financial' ? 'إجمالي الجزاءات' : 'إجمالي البدلات') 
              : (activeTab === 'employees' ? 'Total Salaries' : activeTab === 'financial' ? 'Total Penalties' : 'Total Allowances')}
          </div>
          <div className="stat-value">
            {activeTab === 'employees'
              ? (initialEmployees?.reduce((sum, e) => sum + e.basicSalary, 0) || 0).toLocaleString()
              : activeTab === 'financial'
                ? (initialMoves?.filter(m => m.type === 'Penalty').reduce((s, m) => s + m.amount, 0) || 0).toLocaleString()
                : (initialMoves?.filter(m => m.type === 'Allowance').reduce((s, m) => s + m.amount, 0) || 0).toLocaleString()} 
            <span className="currency"> SAR</span>
          </div>
          <div className="stat-footer">{lang === 'ar' ? 'شهرياً' : 'Monthly'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            {lang === 'ar' 
              ? (activeTab === 'employees' ? 'على رأس العمل' : 'المتوسط العمليات') 
              : (activeTab === 'employees' ? 'On Duty' : 'Avg per Transaction')}
          </div>
          <div className="stat-value">
            {activeTab === 'employees'
              ? initialEmployees?.filter(e => e.status === 'Active').length
              : (initialMoves?.filter(m => activeTab === 'financial' ? (['Advance', 'AdvanceDeduction', 'Penalty'].includes(m.type)) : (['Reward', 'Allowance', 'AdvanceAddition'].includes(m.type))).reduce((s, m) => s + m.amount, 0) / 
                 (initialMoves?.filter(m => activeTab === 'financial' ? (['Advance', 'AdvanceDeduction', 'Penalty'].includes(m.type)) : (['Reward', 'Allowance', 'AdvanceAddition'].includes(m.type))).length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="stat-footer text-primary">{activeTab === 'employees' ? 'Stable' : 'Per record'}</div>
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder={activeTab === 'employees' 
                ? (lang === 'ar' ? 'بحث عن موظف (الاسم، الكود، الوظيفة)...' : 'Search employee (Name, Code, Title)...')
                : (lang === 'ar' ? 'بحث عن عملية (الموظف، السبب)...' : 'Search transaction (Employee, Reason)...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          {activeTab === 'employees' ? (
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
                  <th>{lang === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}</th>
                  <th>{lang === 'ar' ? 'تاريخ الانضمام' : 'Join Date'}</th>
                  <th>{lang === 'ar' ? 'الراتب الأساسي' : 'Basic Salary'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-state">
                      {lang === 'ar' ? 'لا يوجد موظفين حالياً' : 'No employees found'}
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map(emp => (
                    <tr key={emp.id}>
                      <td>
                        <div className="emp-info">
                          <div className="emp-avatar">{emp.name[0]}</div>
                          <div>
                            <div className="emp-name">{lang === 'ar' && emp.nameAr ? emp.nameAr : emp.name}</div>
                            <div className="emp-code">{emp.code}</div>
                          </div>
                        </div>
                      </td>
                      <td>{lang === 'ar' && emp.jobTitleAr ? emp.jobTitleAr : emp.jobTitle}</td>
                      <td>{formatDate(emp.joinDate)}</td>
                      <td className="salary">{(emp.basicSalary || 0).toLocaleString()} SAR</td>
                      <td>
                        <span className={`status-badge ${emp.status?.toLowerCase()}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button className="icon-btn" title="Edit">✏️</button>
                          <button className="icon-btn" title="View Documents">📄</button>
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
                {filteredMoves.filter(m => activeTab === 'rewards' ? (m.type === 'Reward' || m.type === 'Allowance') : (m.type === 'Advance' || m.type === 'Penalty')).length === 0 ? (
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
                          {move.status === 'Approved' ? (lang === 'ar' ? 'معتمد' : 'Approved') : (lang === 'ar' ? 'قيد الانتظار' : 'Pending')}
                        </span>
                      </td>
                      <td className="text-sub">{move.reason || '—'}</td>
                      <td>
                        <div className="actions">
                          {processingId === move.id ? (
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>...</span>
                          ) : (
                            <>
                              {move.status !== 'Approved' && (
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
        .page-title { font-size: 2.25rem; font-weight: 900; color: #0f172a; margin-bottom: 0.5rem; letter-spacing: -0.025em; }
        .page-subtitle { color: #64748b; font-size: 1rem; font-weight: 500; }
        
        .tab-switcher { display: flex; background: #f8fafc; padding: 6px; border-radius: 14px; border: 1px solid #e2e8f0; height: fit-content; }
        .tab-btn { padding: 0.75rem 1.5rem; border: none; background: transparent; border-radius: 10px; font-size: 0.9rem; font-weight: 700; color: #64748b; cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .tab-btn.active { background: white; color: #3b82f6; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.05); }
        .tab-btn:hover:not(.active) { color: #0f172a; background: rgba(0,0,0,0.02); }

        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 3rem; }
        .stat-card { background: white; padding: 2rem; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03); transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05); }
        .stat-label { font-size: 0.85rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-bottom: 0.75rem; letter-spacing: 0.05em; }
        .stat-value { font-size: 2rem; font-weight: 900; color: #0f172a; margin-bottom: 0.5rem; }
        .currency { font-size: 1rem; font-weight: 600; color: #cbd5e1; }
        .stat-footer { font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 4px; }
        .stat-footer.positive { color: #10b881; }
        .stat-footer.positive::before { content: '●'; font-size: 0.6rem; }
        
        .card { background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.03); }
        .filter-bar { padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; background: #fff; display: flex; align-items: center; }
        .search-input-wrapper { position: relative; width: 100%; max-width: 480px; }
        .search-input-wrapper svg { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .search-input-wrapper input { width: 100%; padding: 0.875rem 1rem 0.875rem 3.25rem; border-radius: 12px; border: 1.5px solid #f1f5f9; font-size: 0.95rem; background: #f8fafc; transition: all 0.2s; }
        .search-input-wrapper input:focus { outline: none; border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08); }
        
        [dir="rtl"] .search-input-wrapper svg { left: auto; right: 1.25rem; }
        [dir="rtl"] .search-input-wrapper input { padding: 0.875rem 3.25rem 0.875rem 1rem; }

        .table-container { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { padding: 1.25rem 2rem; text-align: left; font-size: 0.8rem; font-weight: 800; color: #475569; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
        [dir="rtl"] th { text-align: right; }
        td { padding: 1.25rem 2rem; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #1e293b; }
        tr:hover td { background: #fafafa; }
        
        .emp-info { display: flex; align-items: center; gap: 1.25rem; }
        .emp-avatar { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); color: #2563eb; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.25rem; border: 1px solid #bfdbfe; }
        .emp-name { font-weight: 800; color: #0f172a; }
        .emp-code { font-size: 0.8rem; color: #94a3b8; font-weight: 600; }
        
        .salary { font-weight: 800; color: #059669; }
        .status-badge { padding: 0.35rem 1rem; border-radius: 30px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.025em; }
        .status-badge.active { background: #dcfce7; color: #15803d; }
        .status-badge.advance { background: #eff6ff; color: #1e40af; }
        .status-badge.penalty { background: #fef2f2; color: #991b1b; }
        .status-badge.reward { background: #f0fdf4; color: #16a34a; }
        .status-badge.allowance { background: #faf5ff; color: #7e22ce; }
        .status-badge.approved { background: #dcfce7; color: #15803d; }
        .status-badge.pending { background: #fff7ed; color: #9a3412; }
        
        .actions { display: flex; gap: 0.75rem; justify-content: center; }
        .icon-btn { border: 1.5px solid #f1f5f9; background: white; padding: 0.5rem; border-radius: 10px; cursor: pointer; transition: all 0.2s; color: #64748b; }
        .icon-btn:hover { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }
        
        .empty-state { text-align: center; padding: 6rem; color: #94a3b8; font-weight: 600; }
        .btn-primary { background: #0f172a; color: white; border: none; padding: 0.875rem 2rem; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .btn-primary:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
        .modal-content { background: white; border-radius: 24px; width: 100%; padding: 2.5rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); }
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; }
        .btn-secondary { background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.875rem 2rem; border-radius: 12px; cursor: pointer; font-weight: 800; color: #475569; }

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
