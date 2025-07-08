import React from 'react';

interface PasswordCardProps {
  password: {
    _id: string;
    site: string;
    username: string;
    encryptedPassword: string;
    iv: string;
  };
  decryptedPassword?: string;
  onDecrypt: (id: string, encryptedPassword: string, iv: string) => void;
  onCopy: (password: string) => void;
}

const PasswordCard: React.FC<PasswordCardProps> = ({
  password,
  decryptedPassword,
  onDecrypt,
  onCopy,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{password.site}</h3>
      <p className="text-gray-600 mb-2">
        <span className="font-medium">Username:</span> {password.username}
      </p>

      <div className="mt-4 flex space-x-2">
        {!decryptedPassword ? (
          <button
            onClick={() => onDecrypt(password._id, password.encryptedPassword, password.iv)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Decrypt
          </button>
        ) : (
          <>
            <div className="flex-1 bg-gray-100 p-2 rounded text-sm font-mono truncate">
              {decryptedPassword}
            </div>
            <button
              onClick={() => onCopy(decryptedPassword)}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              Copy
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordCard;
