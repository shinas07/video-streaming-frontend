import CryptoJS from "crypto-js";

export const encryptToken = (token) => {
    const secretKey = import.meta.env.VITE_APP_TOKEN_SECRET;
    if (!secretKey) {
      console.error('Token secret is not defined in environment variables');
      return token;
    }
    return CryptoJS.AES.encrypt(token, secretKey).toString();
  };
  
  export const decryptToken = (encryptedToken) => {
    const secretKey = import.meta.env.VITE_APP_TOKEN_SECRET;
    if (!secretKey) {
      console.error('Token secret is not defined in environment variables');
      return encryptedToken;
    }
    const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }; 
  