"use client";

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const MOCK_DATA = [
  { date: '2. Jun', price: 8.2 },
  { date: '16. Jun', price: 8.5 },
  { date: '30. Jun', price: 9.1 },
  { date: '14. Jul', price: 8.8 },
  { date: '28. Jul', price: 8.9 },
  { date: '11. Aug', price: 8.7 },
  { date: '25. Aug', price: 8.2 },
  { date: '8. Sep', price: 7.9 },
  { date: '22. Sep', price: 7.8 },
  { date: '6. Oct', price: 8.1 },
  { date: '20. Oct', price: 8.5 },
  { date: '3. Nov', price: 10.2 },
  { date: '17. Nov', price: 10.8 },
  { date: '1. Dec', price: 9.5 },
  { date: '15. Dec', price: 9.7 },
  { date: '29. Dec', price: 9.4 },
  { date: '12. Jan', price: 9.2 },
  { date: '26. Jan', price: 9.1 },
  { date: '9. Feb', price: 9.3 },
  { date: '23. Feb', price: 9.2 },
  { date: '9. Mar', price: 10.1 },
  { date: '23. Mar', price: 9.9 },
  { date: '6. Apr', price: 10.3 },
  { date: '20. Apr', price: 10.1 },
  { date: '4. May', price: 10.85 },
];

export default function LiveShareChart() {
  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Share Information Cards */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-[#F0564A]/10 flex items-center justify-center text-[#F0564A]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900">Share Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ticker</p>
            <p className="text-sm font-bold text-slate-900">BIOTX</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ISIN</p>
            <p className="text-sm font-bold text-slate-900">US0010405780</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Market</p>
            <p className="text-sm font-bold text-slate-900">NASDAQ</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Shares Issued</p>
            <p className="text-sm font-bold text-slate-900">76,900,005</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sector</p>
            <p className="text-sm font-bold text-slate-900">Biotech</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Currency</p>
            <p className="text-sm font-bold text-slate-900">USD</p>
          </div>
        </div>
      </div>

      {/* Live Chart Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">Live Share Chart & Data</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered by INFRONT</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-2xl font-light text-slate-600 mb-1">BIOTX THERAPEUTICS INC</h2>
            <p className="text-xs font-bold text-slate-400 mb-4">BIOTX</p>
            <div className="flex items-baseline gap-3">
              <span className="text-sm font-bold text-slate-500">USD</span>
              <span className="text-5xl font-light text-slate-900 tracking-tight">10.85</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              2026-05-10 09:30 (America/New_York)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6 w-full md:w-auto">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Change %</p>
              <p className="text-sm font-bold text-emerald-500">0.25 (2.36%)</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">High / Low</p>
              <p className="text-sm font-bold text-slate-900">10.95 / 10.60</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Turnover</p>
              <p className="text-sm font-bold text-slate-900">183,046.45</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Volume</p>
              <p className="text-sm font-bold text-slate-900">16,984</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Market Cap</p>
              <p className="text-sm font-bold text-slate-900">834.37 M</p>
            </div>
          </div>
        </div>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                dy={10}
              />
              <YAxis 
                domain={['auto', 'auto']}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                orientation="right"
                dx={10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                itemStyle={{ color: '#F0564A' }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#F0564A" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#F0564A', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
