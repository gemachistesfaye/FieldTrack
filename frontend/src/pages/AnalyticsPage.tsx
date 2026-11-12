import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/common/Card';
import { TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Operations & Service Analytics
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Key performance indicators for response velocity, category resolution times, and
          infrastructure health.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Average Resolution Time
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">4.2 hours</h3>
              <p className="text-xs text-emerald-600 mt-1 font-medium">-18% vs last month</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Resolution Rate</p>
              <h3 className="text-2xl font-bold text-teal-700 mt-1">92.4%</h3>
              <p className="text-xs text-slate-500 mt-1">Within target SLA window</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Offline Submissions</p>
              <h3 className="text-2xl font-bold text-brand-600 mt-1">38%</h3>
              <p className="text-xs text-slate-500 mt-1">Originating from offline cache</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incidents by Category</CardTitle>
          <CardDescription>Distribution across critical infrastructure assets</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Water Points & Boreholes</span>
                <span className="text-slate-500">46 reports (36%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: '36%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Mechanical & Electrical Equipment</span>
                <span className="text-slate-500">32 reports (25%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-slate-700 h-2.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Service Interruptions</span>
                <span className="text-slate-500">28 reports (22%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '22%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Safety & Hazard Reports</span>
                <span className="text-slate-500">22 reports (17%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '17%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
