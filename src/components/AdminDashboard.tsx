import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, Clock, Eye, Check, X, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatDate, getMonthName } from '../lib/utils';
import type { LifeCertificate, User } from '../types';

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [certificates, setCertificates] = useState<LifeCertificate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<LifeCertificate | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [certificatesResponse, usersResponse] = await Promise.all([
        supabase
          .from('life_certificates')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('users')
          .select('*')
          .eq('role', 'pensioner')
          .order('created_at', { ascending: false })
      ]);

      if (certificatesResponse.error) throw certificatesResponse.error;
      if (usersResponse.error) throw usersResponse.error;

      setCertificates(certificatesResponse.data || []);
      setUsers(usersResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCertificateAction = async (certificateId: string, status: 'approved' | 'rejected' | 'needs_review') => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('life_certificates')
        .update({
          status,
          admin_notes: adminNotes,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', certificateId);

      if (error) throw error;

      await fetchData();
      setSelectedCertificate(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating certificate:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getUserByCertificate = (certificate: LifeCertificate) => {
    return users.find(u => u.id === certificate.user_id);
  };

  const stats = {
    totalUsers: users.length,
    totalCertificates: certificates.length,
    pendingCertificates: certificates.filter(c => c.status === 'pending').length,
    approvedCertificates: certificates.filter(c => c.status === 'approved').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Manage life certificate submissions and user accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <Users className="h-8 w-8 text-primary-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
          <div className="text-sm text-gray-600">Total Pensioners</div>
        </div>

        <div className="card text-center">
          <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalCertificates}</div>
          <div className="text-sm text-gray-600">Total Certificates</div>
        </div>

        <div className="card text-center">
          <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{stats.pendingCertificates}</div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </div>

        <div className="card text-center">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{stats.approvedCertificates}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Certificate Submissions</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pensioner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.map((certificate) => {
                const pensioner = getUserByCertificate(certificate);
                return (
                  <tr key={certificate.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {pensioner?.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {pensioner?.pension_number}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getMonthName(certificate.month)} {certificate.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(certificate.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        certificate.status === 'approved' ? 'bg-green-100 text-green-800' :
                        certificate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        certificate.status === 'needs_review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {certificate.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedCertificate(certificate)}
                        className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Review Certificate
                </h3>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pensioner</label>
                    <p className="text-sm text-gray-900">
                      {getUserByCertificate(selectedCertificate)?.full_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Period</label>
                    <p className="text-sm text-gray-900">
                      {getMonthName(selectedCertificate.month)} {selectedCertificate.year}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Witness Name</label>
                    <p className="text-sm text-gray-900">{selectedCertificate.witness_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Witness Phone</label>
                    <p className="text-sm text-gray-900">{selectedCertificate.witness_phone}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Relationship</label>
                  <p className="text-sm text-gray-900">{selectedCertificate.witness_relationship}</p>
                </div>

                {selectedCertificate.certificate_photo_url && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Certificate Photo</label>
                    <img
                      src={selectedCertificate.certificate_photo_url}
                      alt="Certificate"
                      className="mt-2 max-w-full h-auto rounded-lg border"
                    />
                  </div>
                )}

                <div>
                  <label className="form-label flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Admin Notes</span>
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="form-input"
                    rows={3}
                    placeholder="Add notes about this certificate..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleCertificateAction(selectedCertificate.id, 'approved')}
                    disabled={actionLoading}
                    className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  
                  <button
                    onClick={() => handleCertificateAction(selectedCertificate.id, 'needs_review')}
                    disabled={actionLoading}
                    className="flex items-center space-x-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Needs Review</span>
                  </button>
                  
                  <button
                    onClick={() => handleCertificateAction(selectedCertificate.id, 'rejected')}
                    disabled={actionLoading}
                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}