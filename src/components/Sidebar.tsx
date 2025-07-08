import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  folders: Array<{
    _id: string;
    name: string;
  }>;
  onAddFolder: () => void;
  onSelectFolder: (folderId: string | null) => void;
  selectedFolder: string | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  folders,
  onAddFolder,
  onSelectFolder,
  selectedFolder,
  onLogout,
}) => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Password Manager</h1>
        {user && (
          <p className="text-sm text-gray-300 mt-1">{user.email}</p>
        )}
      </div>

      <div className="p-4">
        <button
          onClick={() => {
            onSelectFolder(null);
            router.push('/dashboard');
          }}
          className={`w-full text-left px-3 py-2 rounded-md mb-2 ${!selectedFolder ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          All Folders
        </button>

        <div className="flex justify-between items-center mb-2">
          <h2 className="font-medium">Your Folders</h2>
          <button
            onClick={onAddFolder}
            className="text-gray-300 hover:text-white"
            title="Add Folder"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="space-y-1">
          {folders.map((folder) => (
            <button
              key={folder._id}
              onClick={() => onSelectFolder(folder._id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${selectedFolder === folder._id ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              {folder.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

