import dotenv from 'dotenv';
import * as path from 'path';

const ENV_FILE = path.join(__dirname, '../enviroment/DEV', '.env');
dotenv.config({ path: ENV_FILE });
export const configuration = {
    MicrosoftAppType: process.env.MicrosoftAppType || '',
    MicrosoftAppId: process.env.MicrosoftAppId || '',
    MicrosoftAppPassword: process.env.MicrosoftAppPassword || '',
    MicrosoftAppTenantId: process.env.MicrosoftAppTenantId || '',
    BotPort: Number(process.env.BOT_PORT),
    mongoUri: process.env.MONGO_URI,
    mongodbName: process.env.MONGO_DB,
    mongodbUserCollection: process.env.MONGO_DB_USER_CONTEXT,
    waMessageEndpoint: process.env.WA_MSG_BASE_ENDPOINT,
    waApiToken: process.env.WA_API_TOKEN,
    waAppId: process.env.WA_APP_ID,
    waLanguage: process.env.WA_LANGUAGE,
    waNamespace: process.env.WA_NAMESPACE,
    redisHost: process.env.REDIS_HOST,
    redisPort: Number(process.env.REDIS_PORT),
    redisKey: process.env.REDIS_KEY,
    minervaHost: process.env.MINERVA_HOST,
};
