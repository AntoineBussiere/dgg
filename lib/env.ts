const env =
    process.env.NEXT_PUBLIC_VERCEL_ENV ||
    "development";

    
export const redisPrefix = env === 'production' ? '' : env === 'preview' ? 'PREVIEW-' : 'DEV-';

export const cloudinarySuffix = env === 'production' ? '' : env === 'preview' ? '-PREVIEW' : '-DEV';