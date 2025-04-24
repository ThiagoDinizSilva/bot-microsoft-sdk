import { WaterfallStepContext } from 'botbuilder-dialogs';
import { IRecognizer } from '../interfaces/IRecognizer';

//TODO implementar
export default class CustomRecognizer {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    constructor(connectionString: string, options: any) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    topIntent(context: WaterfallStepContext) {}

    recognize(context: WaterfallStepContext, text: string): IRecognizer {
        return {
            text,
            intents: {
                userProfile: { score: 0.95 },
            },
            entities: [{ foo: 'foo' }],
        };
    }
}
