import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Operations & Service Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Municipal incident telemetry, mean time to resolution (MTTR), and dispatch efficiency metrics.
        </p>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Average Resolution Time"
          value="4.2 hours"
          subtitle="18% faster than last month"
          icon={Clock}
          color="amber"
        />

        <StatCard
          title="Resolution Rate (SLA)"
          value="92.4%"
          subtitle="Within 24-hour target window"
          icon={CheckCircle2}
          color="slate"
        />

        <StatCard
          title="Offline Submissions"
          value="38%"
          subtitle="Originated from offline local cache"
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Category Breakdown & Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200/90 shadow-2xs">
          <CardHeader className="p-5 pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900">
              Incidents by Domain Category
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Distribution across critical infrastructure assets
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold mb-1.5">
                <span className="text-slate-800">Water Points & Boreholes</span>
                <span className="text-slate-500 font-mono text-xs">46 reports (36%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: '36%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-1.5">
                <span className="text-slate-800">Mechanical & Heavy Equipment</span>
                <span className="text-slate-500 font-mono text-xs">32 reports (25%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-slate-800 h-2.5 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-1.5">
                <span className="text-slate-800">Electrical & Grid Distribution</span>
                <span className="text-slate-500 font-mono text-xs">28 reports (22%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '22%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-1.5">
                <span className="text-slate-800">Safety Hazards & Shoring</span>
                <span className="text-slate-500 font-mono text-xs">21 reports (17%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '17%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-2xs">
          <CardHeader className="p-5 pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900">
              Regional Response Velocities
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Average technician response time across municipal sectors
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {[
              { sector: 'Sector 1 — Central Business District', time: '1.8 hrs', status: 'Optimal' },
              { sector: 'Sector 2 — Industrial Processing Zone', time: '2.4 hrs', status: 'Optimal' },
              { sector: 'Sector 3 — Kibera Infrastructure Corridor', time: '3.1 hrs', status: 'Normal' },
              { sector: 'Sector 4 — North Storm Drainage Basin', time: '4.7 hrs', status: 'Attention' },
            ].map(sec => (
              <div
                key={sec.sector}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-sm"
              >
                <div>
                  <p className="font-bold text-slate-900">{sec.sector}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Average dispatch to resolution</p>
                </div>
                <div className="text-right">
                  <span className="font-bold font-mono text-slate-900">{sec.time}</span>
                  <span
                    className={`block text-xs font-bold ${
                      sec.status === 'Optimal'
                        ? 'text-emerald-700'
                        : sec.status === 'Normal'
                          ? 'text-amber-700'
                          : 'text-rose-600'
                    }`}
                  >
                    {sec.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
