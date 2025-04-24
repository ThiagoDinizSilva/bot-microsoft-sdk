import { ChoiceFactory, ChoicePrompt, WaterfallStepContext } from 'botbuilder-dialogs';
import { CoreDialog } from '../../external/core/coreDialog';
import { Configuration } from '../../external/common/Configuration';
import { PromptUtils } from '../../external/common/PromptUtils';
import { PROMPT_TAGS } from '../../external/common/PromptTags';

const CHOICE_PROMPT = 'CHOICE_PROMPT';

export default class MenuDialog extends CoreDialog {
    public static id: string = 'menu';
    protected messageIds = require('./messageIds.json');
    constructor(config: Configuration) {
        super(MenuDialog.id, config);
        super.addDialog(new ChoicePrompt(CHOICE_PROMPT, PromptUtils.getRetriesValidator(3)));
        this.addDialogToSet([this.transportStep.bind(this), this.nameStep.bind(this)]);
    }

    private async transportStep(stepContext: WaterfallStepContext) {
        this.logger.info({
            message: `started transportStep`,
        });
        return await stepContext.prompt(CHOICE_PROMPT, {
            choices: ChoiceFactory.toChoices(['Autenticação', 'Cadastro de Usuário']),
            prompt: {
                text: 'Menu Principal - Escolha uma opção: ',
                attachments: [
                    {
                        contentType: PROMPT_TAGS.INTERACTIVE_BUTTON,
                        content: [
                            {
                                id: 'auth',
                                title: 'Autenticação',
                            },
                            {
                                id: 'userProfile',
                                title: 'Cadastro de Usuário',
                            },
                        ],
                    },
                ],
            },
            retryPrompt: {
                text: 'Tente novamente - Escolha uma opção: ',
                attachments: [
                    {
                        contentType: PROMPT_TAGS.INTERACTIVE_BUTTON,
                        content: [
                            {
                                id: 'auth',
                                title: 'Autenticação',
                            },
                            {
                                id: 'userProfile',
                                title: 'Cadastro de Usuário',
                            },
                        ],
                    },
                ],
            },
        });
    }

    private async nameStep(stepContext: WaterfallStepContext) {
        const dialogId = ['authentication', 'userProfile'];
        return await this.redirectToDialog(stepContext, dialogId[stepContext.result.index], stepContext.options);
    }
}
