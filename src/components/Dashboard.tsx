import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { SubmitCertificate } from './SubmitCertificate';
import { CertificateHistory } from './CertificateHistory';
import type { User } from '../types';

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome, {user.full_name}
        </h2>
        <p className="text-gray-600">
          Submit your monthly life certificate to maintain your pension benefits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center hover:shadow-lg transition-shadow duration-200">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Monthly Submission</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Submit your life certificate every month
          </p>
        </div>

        <div className="card text-center hover:shadow-lg transition-shadow duration-200">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Quick Review</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Certificates reviewed within 48 hours
          </p>
        </div>

        <div className="card text-center hover:shadow-lg transition-shadow duration-200">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Secure Process</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Witness verification for added security
          </p>
        </div>
      </div>

      <div className="card">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'submit'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Submit Certificate
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Submission History
          </button>
        </div>

        {activeTab === 'submit' ? (
          <SubmitCertificate user={user} />
        ) : (
          <CertificateHistory userId={user.id} />
        )}
      </div>
    </div>
  );
}