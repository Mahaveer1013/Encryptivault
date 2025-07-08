import { pbkdf2Sync, randomBytes } from 'crypto';

export const generateSalt = (): string => {
  return randomBytes(16).toString('hex');
};

export const deriveKey = (password: string, salt: string): string => {
  const iterations = 100000;
  const keyLength = 32; // 256 bits for AES-256
  const derivedKey = pbkdf2Sync(
    password,
    salt,
    iterations,
    keyLength,
    'sha512'
  );
  return derivedKey.toString('hex');
};

export const encryptData = async (
  data: string,
  key: string,
  iv: string
): Promise<string> => {
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    Buffer.from(key, 'hex'),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: Buffer.from(iv, 'hex'),
    },
    cryptoKey,
    new TextEncoder().encode(data)
  );

  return Buffer.from(encrypted).toString('hex');
};

export const decryptData = async (
  encryptedData: string,
  key: string,
  iv: string
): Promise<string> => {
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    Buffer.from(key, 'hex'),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: Buffer.from(iv, 'hex'),
    },
    cryptoKey,
    Buffer.from(encryptedData, 'hex')
  );

  return new TextDecoder().decode(decrypted);
};

export const generateIV = (): string => {
  return randomBytes(12).toString('hex'); // 96 bits for AES-GCM
};
