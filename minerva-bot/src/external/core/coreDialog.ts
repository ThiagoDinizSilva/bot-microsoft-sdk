/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ComponentDialog,
    DialogTurnResult,
    WaterfallDialog,
    WaterfallStep,
    WaterfallStepContext,
} from 'botbuilder-dialogs';
import { Configuration } from '../common/Configuration';
import CoreWaterfallStep from './coreWaterfallStep';

export class CoreDialog extends ComponentDialog {
    private internalId: string;
    private childDialogId: string;
    protected config: Configuration;
    protected logger: Console;
    protected messageIds;
    constructor(id: string, config: Configuration) {
        super(id);
        this.initialDialogId = id;
        this.internalId = id;
        this.childDialogId = this.internalId + ':internal';
        this.config = config;
        this.logger = console;
        this.addDialog(
            new WaterfallDialog(this.id, [
                this.start.bind(this),
                this.runChild.bind(this),
                this.checkRedirect.bind(this),
                this.end.bind(this),
            ])
        );
    }

    protected addDialogToSet(dialogSet: WaterfallStep[]): void {
        super.addDialog(new CoreWaterfallStep(this.childDialogId, dialogSet, this.logger));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected getDialogMessages(step: WaterfallStepContext): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const args: any = step.options;
        return args?.dialogMessages || {};
    }

    protected async redirectToDialog(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        step: WaterfallStepContext<any>,
        dialogId: string,
        options?: object
    ): Promise<DialogTurnResult> {
        return await step.endDialog({
            replaceDialogId: dialogId,
            replaceDialogOptions: {
                ...options,
                intentResult: step.options?.intentResult,
            },
        });
    }

    private async start(step: WaterfallStepContext<any>) {
        return await step.next();
    }

    private async runChild(step: WaterfallStepContext<any>) {
        this.logger.info({
            message: `starting internal dialog [${this.childDialogId}]`,
        });
        if (this.findDialog(this.childDialogId)) {
            return await step.beginDialog(this.childDialogId, step.options);
        } else {
            this.logger.error({
                message: `unable to find dialog [${this.initialDialogId}]`,
                dialogId: this.initialDialogId,
                stack: 'unable to find dialog [${this.initialDialogId}]',
                corr: 'no-corr',
            });
            throw new Error(`unable to find dialog [${this.initialDialogId}]`);
        }
    }

    private async checkRedirect(step: WaterfallStepContext<any>) {
        const replaceDialogId = step.result?.replaceDialogId;
        const replaceDialogOptions = step.result?.replaceDialogOptions;
        this.logger.info({
            message: `replacing current dialog to [${replaceDialogId}]`,
            options: step.options,
        });

        if (replaceDialogId) {
            if (step.findDialog(replaceDialogId)) {
                this.logger.info({ message: `Replacing current dialkog with [${replaceDialogId}]` });
                await step.endDialog();
                return await step.replaceDialog(replaceDialogId, replaceDialogOptions);
            } else {
                this.logger.error({
                    message: `Error trying to replace current dialog  to [${replaceDialogId}]`,
                    status: 404,
                    stack: `Error trying to replace current dialog  to [${replaceDialogId}]\nDialog not found on current stack`,
                    corr: 'no-corr',
                });
            }
        }

        return await step.next();
    }

    private async end(step: WaterfallStepContext<any>) {
        this.logger.info({ message: 'ending current dialog' });
        return await step.endDialog();
    }
}
