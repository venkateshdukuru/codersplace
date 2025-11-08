// src/config/env.ts
import dotenv from 'dotenv';
dotenv.config();

interface Config {
  PORT: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  REDIS: string;
  NODE_ENV: string;
  ALLOWED_ORIGINS: string;
  FRONTEND_URL: string;
  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_USER: string;
  MAIL_PASS: string;
  MAIL_FROM: string;
  JUDGE0_URL: string;
  JUDGE0_KEY: string;
  IMAGEKIT_PUBLIC_KEY: string;
  IMAGEKIT_PRIVATE_KEY: string;
  IMAGEKIT_URL_ENDPOINT: string;
}

export const config: Config = {
  PORT: process.env.PORT || "5002",
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/codersplace',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  REDIS: process.env.REDIS || 'redis://localhost:6379',
  NODE_ENV: process.env.NODE_ENV || 'development',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "http://localhost:3000,http://localhost:5173,https://codersplace.vercel.app,https://www.codersplace.in/",
  FRONTEND_URL: "https://www.codersplace.in/",
  MAIL_HOST: process.env.MAIL_HOST || 'smtp.gmail.com',
  MAIL_PORT: process.env.MAIL_PORT || '587',
  MAIL_USER: process.env.MAIL_USER || '',
  MAIL_PASS: process.env.MAIL_PASS || '',
  MAIL_FROM: process.env.MAIL_FROM || process.env.MAIL_USER || 'noreply@codersplace.com',
  JUDGE0_URL: process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com',
  JUDGE0_KEY: process.env.JUDGE0_KEY || '',
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY || '',
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || '',
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT || '',
};
