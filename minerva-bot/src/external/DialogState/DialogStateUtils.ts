/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatePropertyAccessor, TurnContext } from 'botbuilder';
import { turnKeys } from '../../utils/botUtils';

interface IDataAcessor {
    [key: string]: StatePropertyAccessor<any>;
}

export class DialogStateUtils {
    /**
     * Retrieves and wraps the conversation and user data in a Proxy to handle automatic persistence of state.
     *
     * @param {TurnContext} context - The current TurnContext for the conversation.
     * @returns {Promise<{ conversationData: Proxy<any>, userData: Proxy<any> }>}
     * An object containing proxies for `conversationData` and `userData`. Changes to these objects are automatically saved.
     *
     *
     * `conversationData` is cleared everytime a context.endDialog() is called
     * `userData` is cleared once a day at the end of the day
     */
    public static async getPersistentData(context: TurnContext): Promise<{ conversationData: any; userData: any }> {
        const dataAccessor: IDataAcessor = context.turnState.get(turnKeys.PERSISTENT_DATA);
        const persistentData: any = {};
        persistentData.conversationData = await dataAccessor.conversationDataAccessor.get(context, {});
        persistentData.userData = await dataAccessor.userDataAccessor.get(context, {});
        persistentData.dialogData = await dataAccessor.dialogStateAccessor.get(context, {});
        return persistentData;
    }
}
