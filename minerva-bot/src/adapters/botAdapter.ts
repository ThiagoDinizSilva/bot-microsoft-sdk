import {
    Activity,
    ChannelAccount,
    CloudAdapter,
    ConfigurationBotFrameworkAuthentication,
    ConfigurationBotFrameworkAuthenticationOptions,
    ConversationAccount,
    TurnContext,
} from 'botbuilder';
import { MainBot } from '../bots/mainBot';
import axios from 'axios';
import { configuration } from '../configuration';
import { DirectLineTransformer } from '../utils/DirectLineTransformer';
import { v5 as uuidV5 } from 'uuid';
const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(
    configuration as ConfigurationBotFrameworkAuthenticationOptions
);

export class CustomCloudAdapter extends CloudAdapter {
    constructor(botFrameworkAuthentication: ConfigurationBotFrameworkAuthentication) {
        super(botFrameworkAuthentication);
    }

    async processIncommingMessage(req, res, mainBot: MainBot) {
        try {
            const body = req.body;
            const context = new TurnContext(this, {
                type: body.type,
                id: uuidV5(body.id, configuration.waNamespace),
                from: { id: body.from.id } as ChannelAccount,
                conversation: {
                    id: uuidV5(body.from.id + '_-_', configuration.waNamespace),
                } as ConversationAccount,
                text: body.text,
                serviceUrl: body.serviceUrl,
                locale: 'pt-br',
                channelId: body.channel.id,
                channelData: body.channelData,
            });
            await mainBot.run(context);
        } catch (error) {
            console.log('UNMAPED - calling fallback');
            console.log(error);
        }
    }

    async sendActivities(context: TurnContext, activities: Partial<Activity>[]) {
        let responses = [];
        for (const activity of activities) {
            if (activity.type === 'message' && activity.text) {
                const response = await this.directLineHandler(activity);
                responses.push(response);
            }

            if (activity.type === 'message' && activity.action == 'REDIRECT.COMMAND') {
                const channelData = context.activity.channelData;
                context.activity.text = channelData.minervaCommand.customData.data.value;
                responses = [];
                await context.sendActivity(context.activity);
            }
        }
        return responses;
    }

    private async directLineHandler(activity: Partial<Activity>) {
        const payload = DirectLineTransformer.processActivity(activity);
        const headers = {
            Authorization: `Bearer ${configuration.waApiToken}`,
            'Content-Type': 'application/json',
        };
        try {
            //todo post to minerva-chat
            const response = await axios.post('localhost:3001', payload, { headers });
            return response.data;
        } catch (error) {
            console.error('Error sending message to WhatsApp:', error);
            throw error;
        }
    }
}

const adapter = new CustomCloudAdapter(botFrameworkAuthentication);

export default adapter;
