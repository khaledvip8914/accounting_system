import { useState, useEffect } from 'react';

export default function CreateYearModal({
  yearToEdit,
  lang,
  onClose,
  onSave
}: {
  yearToEdit?: any;
  lang: 'ar' | 'en';
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isActive: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (yearToEdit) {
      setFormData({
        name: yearToEdit.name,
        startDate: new Date(yearToEdit.startDate).toISOString().split('T')[0],
        endDate: new Date(yearToEdit.endDate).toISOString().split('T')[0],
        isActive: yearToEdit.isActive
      });
    } else {
      // Default to current year
      const currentYear = new Date().getFullYear();
      setFormData({
        name: currentYear.toString(),
        startDate: `${currentYear}-01-01`,
        endDate: `${currentYear}-12-31`,
        isActive: true
      });
    }
  }, [yearToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            {yearToEdit 
              ? (lang === 'ar' ? 'تعديل السنة المالية' : 'Edit Financial Year') 
              : (lang === 'ar' ? 'سنة مالية جديدة' : 'New Financial Year')}
          </h2>
          <button type="button" className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>{lang === 'ar' ? 'اسم السنة (مثال: 2026)' : 'Year Name (e.g. 2026)'}</label>
            <input 
              type="text" 
              className="form-control" 
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {!yearToEdit && (
            <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>{lang === 'ar' ? 'تاريخ البداية' : 'Start Date'}</label>
                <input 
                  type="date" 
                  className="form-control" 
                  required
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>{lang === 'ar' ? 'تاريخ النهاية' : 'End Date'}</label>
                <input 
                  type="date" 
                  className="form-control" 
                  required
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="isActive"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <label htmlFor="isActive" style={{ margin: 0, cursor: 'pointer' }}>
              {lang === 'ar' ? 'تعيين كسنة مالية افتراضية (نشطة)' : 'Set as default (active) financial year'}
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? '...' : (lang === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
