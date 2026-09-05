import 'dotenv/config';

export const PORT = Number(process.env.PORT || 5000);
export const JWT_SECRET = process.env.JWT_SECRET || 'flavorly_dev_secret_change_in_production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';