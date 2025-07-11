import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Eye, Calendar, User, Phone, FileText, Download, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatDate, getMonthName } from '../lib/utils';
import type { LifeCertificate } from '../types';

interface CertificateHistoryProps {
  userId: string;
}

export function CertificateHistory({ userId }: CertificateHistoryProps) {
  const [certificates, setCertificates] = useState<LifeCertificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, [userId]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('life_certificates')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'needs_review':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'needs_review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="h-10 w-10 text-indigo-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Submissions Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          You haven't submitted any life certificates yet. Submit your first certificate to get started and maintain your pension benefits.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Certificate History
          </h3>
        </div>
        <p className="text-gray-600 ml-13">
          View all your submitted life certificates and their status
        </p>
      </div>

      <div className="space-y-6">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  certificate.status === 'approved' ? 'bg-green-100' :
                  certificate.status === 'rejected' ? 'bg-red-100' :
                  certificate.status === 'needs_review' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  {getStatusIcon(certificate.status)}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <h4 className="text-lg font-semibold text-gray-900">
                      {getMonthName(certificate.month)} {certificate.year}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Submitted on {formatDate(certificate.created_at)}</span>
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(certificate.status)}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    certificate.status === 'approved' ? 'bg-green-500' :
                    certificate.status === 'rejected' ? 'bg-red-500' :
                    certificate.status === 'needs_review' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}></div>
                  {certificate.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Witness Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                    <p className="text-sm font-medium text-gray-900">{certificate.witness_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{certificate.witness_phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Relationship</p>
                    <p className="text-sm font-medium text-gray-900">{certificate.witness_relationship}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {certificate.certificate_photo_url && (
                  <button
                    onClick={() => window.open(certificate.certificate_photo_url, '_blank')}
                    className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Certificate</span>
                  </button>
                )}
              </div>

              <div className="text-xs text-gray-500">
                ID: {certificate.id.slice(0, 8)}...
              </div>
            </div>

            {certificate.admin_notes && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 mb-1">Admin Notes:</p>
                    <p className="text-sm text-amber-700">{certificate.admin_notes}</p>
                  </div>
                </div>
                {certificate.reviewed_at && (
                  <p className="text-xs text-amber-600 mt-2 ml-6">
                    Reviewed on {formatDate(certificate.reviewed_at)}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}