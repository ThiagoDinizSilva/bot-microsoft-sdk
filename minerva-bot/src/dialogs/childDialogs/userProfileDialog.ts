import { ChoicePrompt, TextPrompt, WaterfallStepContext } from 'botbuilder-dialogs';
import { CoreDialog } from '../../external/core/coreDialog';
import { Configuration } from '../../external/common/Configuration';
import { DialogStateUtils } from '../../external/DialogState/DialogStateUtils';
import { PromptUtils } from '../../external/common/PromptUtils';
import { MessageWaba } from '../../external/common/MessageWaba';

const templateActivityPersonalizedButton = 'templateActivityPersonalizedButton';
const NAME_PROMPT = 'NAME_PROMPT';
const promptInteractiveButton = 'promptInteractiveButton';
const promptInteractiveList = 'promptInteractiveList';
const promptInteractiveListTwoOptions = 'promptInteractiveListTwoOptions';
const promptCTA = 'promptCTA';

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
        super.addDialog(new ChoicePrompt(templateActivityPersonalizedButton, PromptUtils.getRetriesValidator(3)));
        super.addDialog(new TextPrompt(NAME_PROMPT));
        super.addDialog(new ChoicePrompt(promptInteractiveButton, PromptUtils.getRetriesValidator(3)));
        super.addDialog(new ChoicePrompt(promptInteractiveList, PromptUtils.getRetriesValidator(3)));
        super.addDialog(new ChoicePrompt(promptInteractiveListTwoOptions, PromptUtils.getRetriesValidator(3)));
        super.addDialog(new ChoicePrompt(promptCTA, PromptUtils.getRetriesValidator(3)));
        this.addDialogToSet([
            this.promptText.bind(this),
            this.promptInteractiveButton.bind(this),
            this.promptInteractiveList.bind(this),
            this.promptInteractiveListTwoOptions.bind(this),
            // this.activityCTA.bind(this),
            this.activityTemplate.bind(this),
            this.summaryStep.bind(this),
        ]);
    }

    private async promptText(stepContext: WaterfallStepContext<UserProfile>) {
        const dialogMessages = this.getDialogMessages(stepContext);
        await stepContext.context.sendActivity(dialogMessages['my-first-message']);
        return await stepContext.prompt(NAME_PROMPT, MessageWaba.getTextPrompt('texto de prompt'));
    }

    private async promptInteractiveButton(stepContext: WaterfallStepContext<UserProfile>) {
        stepContext.options.name = stepContext.result;
        await stepContext.context.sendActivity(`Ok, seu nome foi registrado como: [${stepContext.result}].`);
        return await stepContext.prompt(
            promptInteractiveButton,
            MessageWaba.getInteractiveButtonPrompt('teste botao interativo', ['sim', 'nao'])
        );
    }

    private async promptInteractiveList(stepContext: WaterfallStepContext<UserProfile>) {
        await stepContext.context.sendActivity(`Você selecionou [${stepContext.result.value}].`);
        return await stepContext.prompt(
            promptInteractiveList,
            MessageWaba.getInteractiveListPrompt(
                'teste lista interativa',
                [
                    {
                        id: 'botao_1',
                        title: 'botao 1',
                        description: 'descrição 1',
                    },
                    {
                        id: 'botao_2',
                        title: 'botao 2',
                        description: 'descrição 2',
                    },
                    {
                        id: 'botao_3',
                        title: 'botao 3',
                        description: 'descrição 3',
                    },
                    {
                        id: 'botao_4',
                        title: 'botao 4',
                        description: 'descrição 4',
                    },
                ],
                'minha label'
            )
        );
    }

    private async promptInteractiveListTwoOptions(stepContext: WaterfallStepContext<UserProfile>) {
        await stepContext.context.sendActivity(`Você selecionou [${stepContext.result.value}].`);
        return await stepContext.prompt(
            promptInteractiveListTwoOptions,
            MessageWaba.getInteractiveListPrompt(
                'teste lista interativa',
                [
                    {
                        id: 'botao_1',
                        title: 'botao 1',
                        description: 'descrição 1',
                    },
                    {
                        id: 'botao_2',
                        title: 'botao 2',
                        description: 'descrição 2',
                    },
                ],
                'minha label'
            )
        );
    }

    async activityCTA(stepContext: WaterfallStepContext<UserProfile>) {
        await stepContext.context.sendActivity(`Você selecionou [${stepContext.result?.value}].`);
        await stepContext.context.sendActivity(
            MessageWaba.getActivityCallToAction('texto do CTA', {
                url: 'https://www.youtube.com/watch?v=xvFZjo5PgG0',
                title: 'Clique Aqui',
            })
        );
        return await stepContext.next();
    }

    async activityPDF(stepContext: WaterfallStepContext<UserProfile>) {
        await stepContext.context.sendActivity(
            MessageWaba.getPDFActivity('texto do PDF', {
                url: 'https://pdfobject.com/pdf/sample.pdf',
                body: 'Clique Aqui',
                filename: 'meu-pdf',
            })
        );
        return await stepContext.next();
    }

    async activityIMG(stepContext: WaterfallStepContext<UserProfile>) {
        await stepContext.context.sendActivity(
            MessageWaba.getIMGActivity('texto do IMG', {
                url: 'https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U',
                body: 'Clique Aqui',
            })
        );
        return await stepContext.next();
    }

    async activityTemplate(stepContext: WaterfallStepContext<UserProfile>) {
        await stepContext.context.sendActivity(MessageWaba.getTextActivity(`aqui ola_mundo_teste`));
        await stepContext.context.sendActivity(
            MessageWaba.getTemplateActivity('ola_mundo_teste', ['fulano', 'hello world', '1234'])
        );
        return await stepContext.next();
    }

    private async summaryStep(stepContext: WaterfallStepContext<UserProfile>) {
        try {
            await stepContext.context.sendActivity(
                MessageWaba.getTextActivity(`você clicou no botão, aqui está seu resumo`)
            );

            if (stepContext.result) {
                const { conversationData } = await DialogStateUtils.getPersistentData(stepContext.context);
                const stepContextOptions = stepContext.options;
                conversationData.name = stepContextOptions.name;
                const msg = `sucesso ao registrar seu nome como [${conversationData.name}].`;
                await stepContext.context.sendActivity(msg);
            }
            return await stepContext.endDialog();
        } catch (error) {
            this.logger.error({
                message: 'user-profile-dialog something went wrong',
                stack: error,
                corr: 'no-corr',
            });
            return await stepContext.endDialog();
        }
    }
}
