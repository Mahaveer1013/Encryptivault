import * as CryptoJS from 'crypto-js';

export const encrypt = (data: string, key: string, iv: string) => {
  return CryptoJS.AES.encrypt(data, key, { iv: CryptoJS.enc.Hex.parse(iv) }).toString();
};

export const decrypt = (ciphertext: string, key: string, iv: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key, { iv: CryptoJS.enc.Hex.parse(iv) });
  return bytes.toString(CryptoJS.enc.Utf8).trim();
};

export const generateSalt = () => {
  return CryptoJS.lib.WordArray.random(128/8).toString();
};

export const hashKey = (key: string, salt: string) => {
  return CryptoJS.PBKDF2(key, salt, {
    keySize: 256/32,
    iterations: 1000
  }).toString();
};
