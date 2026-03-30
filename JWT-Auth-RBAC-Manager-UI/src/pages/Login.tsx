import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { LoginRequest } from '../types/auth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const user = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as 'USER' | 'ADMIN',
        createdAt: new Date().toISOString(),
      };
      login(user, data.token);
      navigate('/dashboard');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Login failed');
    },
  });

  const onSubmit = (data: LoginRequest) => {
    setError('');
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md animate-slideUp">
        {/* Card Container */}
        <div className="card overflow-hidden shadow-xl">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <svg
                  className="w-7 h-7 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-center text-3xl font-bold text-white">Sign In</h1>
            <p className="text-center text-primary-100 text-sm mt-2">
              Welcome back! Please sign in to your account
            </p>
          </div>

          {/* Form Content */}
          <div className="px-6 py-8">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="form-input"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-danger-600 text-xs mt-1.5 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  {...register('password', { required: 'Password is required' })}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="form-input"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-danger-600 text-xs mt-1.5 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 flex items-start">
                  <svg className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-danger-700 text-sm font-medium ml-3">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="btn-primary w-full justify-center"
              >
                {loginMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link
              to="/register"
              className="btn-secondary w-full justify-center mt-6"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create Account
            </Link>
          </div>
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Demo credentials available on registration
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;