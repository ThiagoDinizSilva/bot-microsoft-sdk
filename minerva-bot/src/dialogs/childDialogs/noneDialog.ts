import { WaterfallStepContext } from 'botbuilder-dialogs';
import { CoreDialog } from '../../external/core/coreDialog';
import { Configuration } from '../../external/common/Configuration';
import { MessageWaba } from '../../external/common/MessageWaba';

class UserProfile {
    public transport: string;
    public name: string;
    public age: number;
}
export default class UserProfileDialog extends CoreDialog {
    public static id: string = 'userProfile';
    protected messageIds = require('./messageIds.json');
    constructor(config: Configuration) {
        super(UserProfileDialog.id, config);
        this.addDialogToSet([this.sendEntity.bind(this)]);
    }

    private async sendEntity(stepContext: WaterfallStepContext<UserProfile>) {
        const dialogMessages = this.getDialogMessages(stepContext);
        await stepContext.context.sendActivity(dialogMessages['my-first-message']);
        return await stepContext.endDialog();
    }
}
