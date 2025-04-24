import { ConversationState } from 'botbuilder-core';
import MongoAdapter from './adapters/mongoAdapter';
import MongoStorage from './storage/mongoStorage';
import { Main } from './dialogs/Main';
import { MainBot } from './bots/mainBot';
import { configuration } from './configuration';
import server from './server';
import adapter from './adapters/botAdapter';
import botRoutes from './routes/botRoutes';

(async () => {
    const mongoAdapter = MongoAdapter.getInstance(configuration.mongoUri, configuration.mongodbName);
    const dbClient = await mongoAdapter.connect();
    const conversationState = new ConversationState(new MongoStorage(dbClient, configuration.mongodbUserCollection));
    const userState = new ConversationState(new MongoStorage(dbClient, configuration.mongodbUserCollection));

    const dialogState = new ConversationState(new MongoStorage(dbClient, configuration.mongodbUserCollection));
    const dialog = new Main(configuration);
    const mainBot = new MainBot(conversationState, userState, dialogState, dialog);
    botRoutes(server, adapter, mainBot);
})();
