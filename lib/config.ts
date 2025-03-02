// 客户端和服务器端都可以访问的配置
export const publicConfig = {
    backendApiUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080/api',
    frontendApiUrl: process.env.NEXT_PUBLIC_FRONTEND_API_URL || 'http://localhost:3000/api',
    appName: process.env.NEXT_PUBLIC_APP_NAME || '网页内容提取器',
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
};

// 仅服务器端可以访问的配置
export const serverConfig = {
    apiSecretKey: process.env.API_SECRET_KEY,
    databaseUrl: process.env.DATABASE_URL,
};

// 环境判断
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test'; 