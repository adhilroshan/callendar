'use client';

import { useState } from 'react';
import { TestCallButton } from './test-call-button';
import { TwilioStatus } from './twilio-status';

export function TestCallSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      <div 
        className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h2 className="text-lg font-semibold text-white">
            Developer Tools
          </h2>
          <p className="mt-1 text-sm text-gray-300">
            Testing and debugging features
          </p>
        </div>
        <div className="text-white">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-6 py-6 border-t border-gray-700">
          {/* Twilio Configuration Status */}
          <TwilioStatus />
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-900 mb-2">Test Call Feature</h3>
            <p className="text-sm text-gray-600 mb-4">
              This tool allows you to test the Twilio calling functionality by sending a test call to your registered phone number.
            </p>
            
            <TestCallButton />
          </div>
        </div>
      )}
    </div>
  );
} 