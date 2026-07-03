// Progress tracker component

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressTrackerProps {
  currentStep: 1 | 2;
  totalSteps?: number;
  steps?: string[];
}

export function ProgressTracker({
  currentStep,
  totalSteps = 2,
  steps = ['Aadhaar & OTP', 'Business Details'],
}: ProgressTrackerProps) {
  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              {/* Step circle */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300',
                    index + 1 < currentStep
                      ? 'bg-success-500 text-white'
                      : index + 1 === currentStep
                      ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                      : 'bg-gray-200 text-gray-600'
                  )}
                >
                  {index + 1 < currentStep ? '✓' : index + 1}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      'text-sm font-medium transition-colors duration-300',
                      index + 1 <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    )}
                  >
                    {step}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-1 mx-2 mb-6 transition-colors duration-300',
                    index + 1 < currentStep
                      ? 'bg-success-500'
                      : 'bg-gray-300'
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Progress percentage */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
