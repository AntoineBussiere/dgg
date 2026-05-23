import { Redis } from "@upstash/redis"

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})
const env =
    process.env.VERCEL_ENV ||
    process.env.NODE_ENV ||
    "development";

export const redisPrefix = env !== 'production' ? 'DEV-' : '';