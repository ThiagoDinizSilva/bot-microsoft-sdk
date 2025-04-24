import { ActivityHandler, BotState, TurnContext } from 'botbuilder';
import { Dialog, DialogContext, DialogSet, DialogState } from 'botbuilder-dialogs';
import { Main } from '../dialogs/Main';
import { loadDialogs, turnKeys } from '../utils/botUtils';
import path from 'path';

export class MainBot extends ActivityHandler {
    private conversationState: BotState;
    private userState: BotState;
    private dialogState: BotState;
    private dialog: Dialog;
    private dialogContext: DialogContext;
    private dialogs: DialogSet;
    private logger: Console;

    /**
     *
     * @param {BotState} conversationState
     * @param {BotState} userState
     * @param {Dialog} dialog
     */
    constructor(conversationState: BotState, userState: BotState, dialogState: BotState, dialog: Dialog) {
        super();
        this.conversationState = conversationState;
        this.userState = userState;
        this.dialogState = dialogState;
        this.dialog = dialog;
        this.logger = console;

        this.onMessage(async (context, next) => {
            return await this.handleUserInput(context, next);
        });
    }

    private async handleUserInput(context: TurnContext, next) {
        this.logger.debug({ message: 'Running dialog with Message Activity.' });
        if (!this.dialogs) {
            this.logger.info({ message: 'Loading Dialogs' });
            const dialogDataAccessor = this.dialogState.createProperty<DialogState>(turnKeys.DIALOG_STATE);
            this.dialogs = new DialogSet(dialogDataAccessor);
            //Carregando a lista do dialogo no contexto do usuario
            loadDialogs(path.join(__dirname, '../dialogs/childDialogs'), this.dialogs);
        }

        //bot recebeu uma intent ao invés de um texto livre, redirecionar para a intent
        if (context.activity.action == 'REDIRECT.COMMAND') {
            this.logger.info({ message: 'Command detected, stopping normal activity flow and executing command' });
        }

        this.dialogContext = await this.dialogs.createContext(context);
        await (this.dialog as Main).run(context, this.dialogContext);
        await next();
    }

    public async run(context: TurnContext): Promise<void> {
        context.turnState.set(turnKeys.PERSISTENT_DATA, {
            conversationDataAccessor: this.conversationState.createProperty(turnKeys.CONVERSATION_DATA),
            userDataAccessor: this.userState.createProperty(turnKeys.USER_DATA),
            dialogStateAccessor: this.conversationState.createProperty(turnKeys.DIALOG_STATE),
        });
        await super.run(context);
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
        await this.dialogState.saveChanges(context, false);
    }
}
