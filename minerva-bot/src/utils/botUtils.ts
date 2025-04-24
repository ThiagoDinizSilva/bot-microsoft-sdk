import { DialogSet } from 'botbuilder-dialogs';
import * as fs from 'fs';
import * as path from 'path';
import { configuration } from '../configuration';

export const loadDialogs = (origin: string, dialogSet: DialogSet) => {
    const files: string[] = fs.readdirSync(origin);
    files.forEach((file) => {
        if (!file.includes('.json')) {
            const filePath = path.join(origin, file);
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const dialogModule = require(filePath);
            const DialogClass = dialogModule.default;
            const dialogId = dialogModule.default.id || DialogClass?.id;
            if (DialogClass && dialogId) {
                dialogSet.add(new DialogClass(configuration));
            }
        }
    });
};

export const turnKeys = {
    PERSISTENT_DATA: 'BotPersistentData',
    DIALOG_STATE: 'dialogState',
    CONVERSATION_DATA: 'conversationData',
    USER_DATA: 'userData',
};
