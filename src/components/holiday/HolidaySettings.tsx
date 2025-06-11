
import React from 'react';
import HolidaySettingsHeader from './settings/HolidaySettingsHeader';
import HolidayForm from './settings/HolidayForm';
import HolidayList from './settings/HolidayList';
import { useHolidaySettings } from './settings/hooks/useHolidaySettings';

const HolidaySettings: React.FC = () => {
  const {
    holidays,
    loading,
    editingHoliday,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm
  } = useHolidaySettings();

  return (
    <div className="space-y-6 mt-6">
      <HolidaySettingsHeader isEditing={!!editingHoliday} />

      <HolidayForm
        formData={formData}
        setFormData={setFormData}
        editingHoliday={editingHoliday}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />

      <HolidayList
        holidays={holidays}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default HolidaySettings;
