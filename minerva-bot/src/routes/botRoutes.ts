import Joi from 'joi';
import { CustomCloudAdapter } from '../adapters/botAdapter';
import { MainBot } from '../bots/mainBot';
import { DialogStateUtils } from '../external/DialogState/DialogStateUtils';
import express from 'express';

const logger = console;
export default function (app: express.Express, adapter: CustomCloudAdapter, mainBot: MainBot) {
    adapter.onTurnError = async (context, error) => {
        logger.error({
            message: `\n [onTurnError] unhandled error: ${error}`,
            corr: 'no-corr',
            err: error,
            stack: error.stack,
        });
        await context.sendTraceActivity(
            'OnTurnError Trace',
            `${error}`,
            'https://www.botframework.com/schemas/error',
            'TurnError'
        );

        await context.sendActivity('The bot encountered an error or bug.');
        await context.sendActivity('To continue to run this bot, please fix the bot source code.');
        const { conversationData, userData } = await DialogStateUtils.getPersistentData(context);
        Object.keys(conversationData).forEach((key) => delete conversationData[key]);
        Object.keys(userData).forEach((key) => delete userData[key]);
    };

    // Define the /api/messages route
    app.post('/api/messages', async (req, res) => {
        try {
            const messagePayloadSchema = Joi.object({
                type: Joi.string().valid('message').required(),
                id: Joi.string().required(),
                from: Joi.object({
                    id: Joi.string().required(),
                }).required(),
                conversation: Joi.object({
                    id: Joi.string().required(),
                }).required(),
                text: Joi.string().required(),
                serviceUrl: Joi.string().uri().required(),
                channel: Joi.object({
                    id: Joi.string().required(),
                }).required(),
            });

            const body = req.body;
            const joiValidations = messagePayloadSchema.validate(body);
            if (joiValidations?.error) {
                console.error('Validation error:', joiValidations?.error?.details);
                res.status(400).send('Invalid payload structure');
                return;
            }

            res.status(202).send('Message received');
            await adapter.processIncommingMessage(req, res, mainBot);
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal error');
        }
    });
}
