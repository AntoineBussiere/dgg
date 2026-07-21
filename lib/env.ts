const env =
    process.env.VERCEL_ENV ||
    process.env.NODE_ENV ||
    "development";
    
export const redisPrefix = env === 'production' ? '' : env === 'preview' ? 'PREVIEW-' : 'DEV-';

export const cloudinarySuffix = env === 'production' ? '' : env === 'preview' ? '-PREVIEW' : '-DEV';