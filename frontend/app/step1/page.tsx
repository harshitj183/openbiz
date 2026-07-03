// Step 1 page

'use client';

import React, { useState } from 'react';
import { ProgressTracker } from '@/components/ProgressTracker';
import { Step1Form } from '@/components/Step1Form';
import { getSchema } from '@/lib/schema';

export default function Step1Page() {
  const [step1Data, setStep1Data] = useState<Record<string, string | boolean>>({});
  const schema = getSchema();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Udyam Registration
          </h1>
          <p className="text-lg text-gray-600">
            Register your business with the Indian Government
          </p>
        </div>

        {/* Progress Tracker */}
        <ProgressTracker currentStep={1} />

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {schema.step1.title}
            </h2>
            <p className="text-gray-600">{schema.step1.description}</p>
          </div>

          <Step1Form
            onComplete={(data) => {
              setStep1Data(data);
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
