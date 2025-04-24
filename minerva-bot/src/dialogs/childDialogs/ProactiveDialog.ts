import { ActivityTypes } from 'botbuilder';
import { WaterfallStepContext } from 'botbuilder-dialogs';
import { Configuration } from '../../external/common/Configuration';
import { CoreDialog } from '../../external/core/coreDialog';

export default class ProactiveDialog extends CoreDialog {
    public static id: string = 'proactive';
    protected messageIds = require('./messageIds.json');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(config: Configuration) {
        super(ProactiveDialog.id, config);
        this.addDialogToSet([this.sendProactiveMessage.bind(this)]);
    }

    async sendProactiveMessage(stepContext: WaterfallStepContext) {
        const proactiveMessage = {
            type: ActivityTypes.Message,
            text: stepContext.context.activity.channelData.customData.text,
        };
        await stepContext.context.sendActivity(proactiveMessage);
        return await stepContext.endDialog();
    }
}
