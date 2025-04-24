import { Activity } from 'botframework-schema';

export abstract class DirectLineTransformer {
    //TODO post to zapchat
    static processActivity(activity: Partial<Activity>) {
        const basePayload = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: activity.recipient.id,
            type: 'text',
        };
        const payload = {};
        return {
            ...basePayload,
            ...payload,
        };
    }
}
