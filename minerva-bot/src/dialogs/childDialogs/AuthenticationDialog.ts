import { WaterfallStepContext } from 'botbuilder-dialogs';
import { CoreDialog } from '../../external/core/coreDialog';
import { Configuration } from '../../external/common/Configuration';

export default class AuthenticationDialog extends CoreDialog {
    public static id: string = 'authentication';
    protected messageIds = require('./messageIds.json');

    constructor(config: Configuration) {
        super(AuthenticationDialog.id, config);
        this.addDialogToSet([this.exitDialog.bind(this)]);
    }

    private async exitDialog(stepContext: WaterfallStepContext) {
        this.logger.info({
            message: `started exitDialog`,
        });
        await stepContext.context.sendActivity('Você está autenticado');
        return await stepContext.endDialog();
    }
}
