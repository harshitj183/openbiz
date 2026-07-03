// Step 2 page

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressTracker } from '@/components/ProgressTracker';
import { Step2Form } from '@/components/Step2Form';
import { getSchema } from '@/lib/schema';

export default function Step2Page() {
  const router = useRouter();
  const [step2Data, setStep2Data] = useState<Record<string, string | boolean>>({});
  const [step1Data, setStep1Data] = useState<Record<string, string | boolean> | null>(null);
  const [checking, setChecking] = useState(true);
  const schema = getSchema();

  useEffect(() => {
    // Read localStorage only on client side
    const saved = localStorage.getItem('step1Data');
    if (saved) {
      try {
        setStep1Data(JSON.parse(saved));
      } catch {
        setStep1Data(null);
      }
    } else {
      setStep1Data(null);
    }
    setChecking(false);
  }, []);

  // Still loading localStorage
  if (checking) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </main>
    );
  }

  // Step 1 not completed
  if (!step1Data?.aadhaar) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Please complete Step 1 first
            </h1>
            <p className="text-gray-600 mb-6">
              You need to complete Aadhaar verification before proceeding to Step 2.
            </p>
            <button
              onClick={() => router.push('/step1')}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Go to Step 1
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Udyam Registration
          </h1>
          <p className="text-lg text-gray-600">
            Almost there! Complete your business registration.
          </p>
        </div>

        {/* Progress Tracker */}
        <ProgressTracker currentStep={2} />

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {schema.step2.title}
            </h2>
            <p className="text-gray-600">{schema.step2.description}</p>
          </div>

          <Step2Form
            step1Data={step1Data}
            onComplete={(data) => {
              setStep2Data(data);
              // Save to localStorage for persistence
              localStorage.setItem('registrationData', JSON.stringify(data));
            }}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            🔒 Your data is encrypted and secure. We follow government guidelines for data protection.
          </p>
        </div>
      </div>
    </main>
  );
}
