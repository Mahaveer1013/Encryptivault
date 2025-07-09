'use client';

import { useState } from 'react';

interface MasterKeyPromptProps {
  folderName: string;
  onVerify: (key: string) => void;
  onClose?: () => void;
  error?: string;
}

export default function MasterKeyPrompt({ folderName, onVerify, onClose, error }: MasterKeyPromptProps) {
  const [masterKey, setMasterKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(masterKey);
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unlock Folder</h2>
          <p className="text-gray-600 mb-4">Enter master key for "{folderName}"</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="masterKey" className="block text-sm font-medium text-gray-700 mb-1">
                Master Key
              </label>
              <input
                type="password"
                id="masterKey"
                value={masterKey}
                onChange={(e) => setMasterKey(e.target.value)}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your master key"
                autoFocus
              />
            </div>

            <div className="flex justify-end space-x-3">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Unlock
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
