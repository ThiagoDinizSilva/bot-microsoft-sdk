import { TurnContext } from 'botbuilder';
import { ComponentDialog, DialogContext, DialogTurnStatus } from 'botbuilder-dialogs';
import { Configuration } from '../external/common/Configuration';
import { ICommand, RecognizerType } from '../interfaces/IRecognizer';
import { DialogStateUtils } from '../external/DialogState/DialogStateUtils';
import { sanitizeText } from '../external/common';
export class Main extends ComponentDialog {
    private logger: Console;
    private config: Configuration;
    constructor(config: Configuration) {
        super('Main');
        if (!config) throw new Error("[Main]: Missing parameter 'config' is required");
        this.config = config;
        this.logger = console;
    }

    public async run(context: TurnContext, dialogContext: DialogContext) {
        try {
            this.logger.debug({
                message: `main - run method`,
            });
            const command = this.recognizeCommand(context.activity.text);

            //é uma intenção genérica e possúi uma entidade/texto associado como resposta genérica ?
            if (command.type == RecognizerType.COMMAND && command.value == 'intent.gci') {
                this.logger.info({ message: command.value[Object.keys(command.value)[0]] });
                await dialogContext.endDialog();
                return await dialogContext.beginDialog(command.value[Object.keys(command.value)[0]]);
            }

            //TODO se não for GCI, talvez seja a intent de uma jornada específica
            // prosseguir com a busca pelo id correspondente a intent
            if (command.type == RecognizerType.COMMAND) {
                //--not-empty--//
            }

            //fallback menu principal caso não seja possível identificar para onde
            // o usuario quer seguir
            const results = await dialogContext.continueDialog();
            if (results.status === DialogTurnStatus.empty) {
                await dialogContext.beginDialog('menu');
            }

            //TODO validar se funcinoa
            if (results.status === DialogTurnStatus.complete) {
                this.logger.info({ message: 'limpando conversationData' });
                const { conversationData } = await DialogStateUtils.getPersistentData(context);
                Object.keys(conversationData).forEach((key) => delete conversationData[key]);
            }
        } catch (error) {
            this.logger.error({
                message: error.message || error.msg,
                stack: error.stack || error.stck,
                corr: 'no-corr',
            });
            await context.sendActivity('Algo deu errado, tente novamente mais tarde');
            await dialogContext.endDialog();
        }
    }

    //RASA como NLP https://github.com/RasaHQ/rasa
    private recognizeCommand(text: string): ICommand {
        const sanitizedValue = sanitizeText(text);
        const maybeJson = /[{}:"]+/g;
        const intent: ICommand = {
            type: RecognizerType.TEXT,
        } as ICommand;
        try {
            if (maybeJson.test(sanitizedValue)) {
                intent.value = JSON.parse(sanitizedValue);
                intent.type = RecognizerType.COMMAND;
            }
        } catch (error) {
            this.logger.info({ message: 'Invalid Intent Object,following as regular input' });
            intent.value = text;
        }
        //TODO se for um texto livre, consumir RASA NLP para obter a intent
        return intent;
    }
}
