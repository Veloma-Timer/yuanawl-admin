// 通过crypto-js去解密：
// @ts-ignore
import CryptoJS from "crypto-js";
// 加密
export function encryption(key: string, data: string) {
  // Encrypt
  return CryptoJS.AES.encrypt(data, key).toString();
}

// 解密
export function decryption(key: string, data: string) {
  // Decrypt
  const bytes = CryptoJS.AES.decrypt(data, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
