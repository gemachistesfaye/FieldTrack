import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">404 — Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-6">
        The requested field view or incident reference could not be located in this regional
        cluster.
      </p>
      <Link to="/">
        <Button
          variant="industrial"
          className="font-bold shadow-xs text-slate-950"
          leftIcon={<ArrowLeft className="w-4 h-4 text-slate-950" />}
        >
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
