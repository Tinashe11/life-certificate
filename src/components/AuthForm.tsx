import React, { useState } from 'react';
import { FileText, User, Phone, MapPin, Calendar } from 'lucide-react';
import { signIn, signUp } from '../lib/supabase';

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    pension_number: '',
    phone_number: '',
    address: '',
    date_of_birth: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, {
          full_name: formData.full_name,
          pension_number: formData.pension_number,
          phone_number: formData.phone_number,
          address: formData.address,
          date_of_birth: formData.date_of_birth,
          role: 'pensioner',
        });
      } else {
        await signIn(formData.email, formData.password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FileText className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Life Certificate System
          </h1>
          <p className="text-gray-600">
            Monthly verification to protect pension funds
          </p>
        </div>

        <div className="card">
          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-l-lg transition-colors ${
                !isSignUp
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-r-lg transition-colors ${
                isSignUp
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
                minLength={6}
              />
            </div>

            {isSignUp && (
              <>
                <div>
                  <label className="form-label flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Pension Number</label>
                  <input
                    type="text"
                    name="pension_number"
                    value={formData.pension_number}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Address</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="form-label flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Date of Birth</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Register' : 'Sign In')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}