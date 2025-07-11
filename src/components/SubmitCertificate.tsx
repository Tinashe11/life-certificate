import React, { useState } from 'react';
import { Upload, User, Phone, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCurrentMonth, getCurrentYear, getMonthName } from '../lib/utils';
import type { User as UserType } from '../types';

interface SubmitCertificateProps {
  user: UserType;
}

export function SubmitCertificate({ user }: SubmitCertificateProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    witness_name: '',
    witness_phone: '',
    witness_relationship: '',
    certificate_photo: null as File | null,
  });

  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Check if already submitted for this month
      const { data: existing } = await supabase
        .from('life_certificates')
        .select('id')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .single();

      if (existing) {
        throw new Error('You have already submitted a certificate for this month');
      }

      let certificate_photo_url = null;

      // Upload photo if provided
      if (formData.certificate_photo) {
        const fileExt = formData.certificate_photo.name.split('.').pop();
        const fileName = `${user.id}/${currentYear}/${currentMonth}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('certificates')
          .upload(fileName, formData.certificate_photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('certificates')
          .getPublicUrl(fileName);

        certificate_photo_url = publicUrl;
      }

      // Submit certificate
      const { error: insertError } = await supabase
        .from('life_certificates')
        .insert([
          {
            user_id: user.id,
            month: currentMonth,
            year: currentYear,
            witness_name: formData.witness_name,
            witness_phone: formData.witness_phone,
            witness_relationship: formData.witness_relationship,
            certificate_photo_url,
            status: 'pending',
          },
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        witness_name: '',
        witness_phone: '',
        witness_relationship: '',
        certificate_photo: null,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, certificate_photo: file }));
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Certificate Submitted Successfully!
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Your life certificate for {getMonthName(currentMonth)} {currentYear} has been submitted for review.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <p className="text-sm text-green-800">
            <strong>What's next?</strong> Our verification team will review your submission within 48 hours. You'll be notified of the status via email.
          </p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="btn-primary px-6 py-3"
        >
          Submit Another Certificate
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Submit Life Certificate
        </h3>
        <p className="text-gray-600">
          Submit your certificate for {getMonthName(currentMonth)} {currentYear}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>Witness Full Name</span>
            </label>
            <input
              type="text"
              value={formData.witness_name}
              onChange={(e) => setFormData(prev => ({ ...prev, witness_name: e.target.value }))}
              className="form-input"
              required
              placeholder="Enter witness full name"
            />
          </div>

          <div>
            <label className="form-label flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>Witness Phone Number</span>
            </label>
            <input
              type="tel"
              value={formData.witness_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, witness_phone: e.target.value }))}
              className="form-input"
              required
              placeholder="Enter witness phone number"
            />
          </div>
        </div>

        <div>
          <label className="form-label flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>Relationship to Witness</span>
          </label>
          <input
            type="text"
            value={formData.witness_relationship}
            onChange={(e) => setFormData(prev => ({ ...prev, witness_relationship: e.target.value }))}
            className="form-input"
            required
            placeholder="e.g., Neighbor, Friend, Family Member"
          />
        </div>

        <div>
          <label className="form-label flex items-center space-x-1">
            <Upload className="h-4 w-4" />
            <span>Certificate Photo (Optional)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-input"
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload a photo of your life certificate for verification
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
          <p className="text-sm">
            <strong>Important:</strong> Your witness must be available to verify this submission if contacted by our verification team.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Life Certificate'}
        </button>
      </form>
    </div>
  );
}