// Success page

'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/Button';

export default function SuccessPage() {
  const router = useRouter();
  const params = useParams();
  const registrationId = params?.id as string;

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="inline-block w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-success-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Registration Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your Udyam registration has been submitted successfully.
          </p>

          {/* Registration ID */}
          {registrationId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Registration ID
              </p>
              <p className="text-lg font-mono font-bold text-gray-900 break-all">
                {registrationId}
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Check your email for confirmation</li>
              <li>Your Udyam number will be sent shortly</li>
              <li>Download your certificate from the portal</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => {
                if (registrationId) {
                  // Could integrate with backend to fetch details
                  window.print();
                }
              }}
              fullWidth
            >
              Print Certificate
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="secondary"
              fullWidth
            >
              Return to Home
            </Button>
          </div>

          {/* Support */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>Need help?</p>
            <p>
              Contact support:{' '}
              <a
                href="mailto:support@udyam.gov.in"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                support@udyam.gov.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
