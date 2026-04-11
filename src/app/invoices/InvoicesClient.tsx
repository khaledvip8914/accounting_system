'use client';

import React, { useState, useTransition } from 'react';
import './invoices.css';
import { createInvoice } from './actions';

type Invoice = {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  status: string;
  date: Date;
};

export default function InvoicesClient({ initialInvoices, dict }: { initialInvoices: Invoice[], dict: any }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ client: '', amount: '', status: 'Pending', date: '' });
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [isPending, startTransition] = useTransition();

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client || !formData.amount || !formData.date) return;

    startTransition(async () => {
      const result = await createInvoice({
        customerId: formData.client,
        netAmount: parseFloat(formData.amount),
        status: formData.status,
        date: formData.date,
      });

      if (result.success) {
        setShowModal(false);
        setFormData({ client: '', amount: '', status: 'Pending', date: '' });
      } else {
        alert('Error creating invoice');
      }
    });
  };

  return (
    <div className="page-content">
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">{dict.title}</h1>
          <p className="page-subtitle">{dict.subtitle}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          {dict.create}
        </button>
      </div>

      <div className="controls-bar">
        <div className="filters">
          <button className="filter-btn active">{dict.all}</button>
          <button className="filter-btn">{dict.paid}</button>
          <button className="filter-btn">{dict.pending}</button>
          <button className="filter-btn">{dict.overdue}</button>
        </div>
        <div className="search-container" style={{ width: '250px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder={dict.search} />
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{dict.id}</th>
                <th>{dict.client}</th>
                <th>{dict.date}</th>
                <th>{dict.amount}</th>
                <th>{dict.status}</th>
                <th>{dict.actions}</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    {dict.noInvoices}
                  </td>
                </tr>
              )}
              {initialInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: '600' }}>{inv.invoiceNumber}</td>
                  <td>{inv.client}</td>
                  <td className="text-sub">{new Date(inv.date).toLocaleDateString()}</td>
                  <td className={`amt ${inv.status === 'Paid' ? 'positive' : ''}`}>
                    ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <span className={`status ${inv.status === 'Paid' ? 'paid' : inv.status === 'Pending' ? 'pending' : 'overdue'}`}>
                      {inv.status === 'Paid' ? dict.paid : inv.status === 'Pending' ? dict.pending : dict.overdue}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
                      <svg style={{ cursor: 'pointer' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      <svg style={{ cursor: 'pointer', color: 'var(--accent-danger)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{dict.newTitle}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)} type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <form onSubmit={handleCreateInvoice}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{dict.clientName}</label>
                  <input required type="text" className="form-input" placeholder="e.g. Acme Corp" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{dict.amountLabel}</label>
                    <input required type="number" step="0.01" className="form-input" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{dict.dateLabel}</label>
                    <input required type="date" className="form-input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{dict.statusLabel}</label>
                  <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="Paid">{dict.paid}</option>
                    <option value="Pending">{dict.pending}</option>
                    <option value="Overdue">{dict.overdue}</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>{dict.cancel}</button>
                <button type="submit" className="btn-primary" disabled={isPending}>{isPending ? dict.saving : dict.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
