import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { CreateReportModal } from '../components/common/CreateReportModal';

interface ReportModalContextType {
  openCreateReportModal: () => void;
  closeCreateReportModal: () => void;
  isCreateReportOpen: boolean;
}

const ReportModalContext = createContext<ReportModalContextType | undefined>(undefined);

export const ReportModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const openCreateReportModal = () => setIsOpen(true);
  const closeCreateReportModal = () => setIsOpen(false);

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['reports'] });
    queryClient.invalidateQueries({ queryKey: ['reportStatistics'] });
    queryClient.invalidateQueries({ queryKey: ['activityReports'] });
    queryClient.invalidateQueries({ queryKey: ['workflowReports'] });
    // Navigate directly to Reports history so the user can inspect their newly logged incident
    navigate('/reports');
  };

  return (
    <ReportModalContext.Provider
      value={{
        openCreateReportModal,
        closeCreateReportModal,
        isCreateReportOpen: isOpen,
      }}
    >
      {children}
      <CreateReportModal
        isOpen={isOpen}
        onClose={closeCreateReportModal}
        onSuccess={handleSuccess}
      />
    </ReportModalContext.Provider>
  );
};

export const useReportModal = () => {
  const context = useContext(ReportModalContext);
  if (!context) {
    throw new Error('useReportModal must be used within a ReportModalProvider');
  }
  return context;
};
