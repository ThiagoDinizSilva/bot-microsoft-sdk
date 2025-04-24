import { DialogTurnResult, WaterfallDialog, WaterfallStep, WaterfallStepContext } from 'botbuilder-dialogs';

export default class CoreWaterfallStep<O extends object = object> extends WaterfallDialog<O> {
    constructor(
        dialogId: string,
        steps: WaterfallStep[],
        private logger: Console
    ) {
        super(dialogId, steps);
    }

    protected async onStep(step: WaterfallStepContext<O>): Promise<DialogTurnResult> {
        try {
            this.logger.debug({ message: 'onStep CoreWaterfallStep' });
            return await super.onStep(step);
        } catch (err) {
            this.logger.error({
                message: `Something went wrong at [${this.id}]`,
                stack: err.stack,
                corr: 'no-corr',
            });
            throw err;
        }
    }
}
