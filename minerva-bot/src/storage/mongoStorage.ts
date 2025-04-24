import { Storage, StoreItem } from 'botbuilder';
import { Db, ObjectId } from 'mongodb';

export default class MongoStorage implements Storage {
    protected readonly db: Db;
    protected readonly collection: string;

    constructor(db: Db, collection: string = 'botState') {
        this.db = db;
        this.collection = collection;
    }

    // Read the data
    public async read(keys: string[]): Promise<StoreItem> {
        const result: StoreItem = {};
        const collection = this.db.collection(this.collection);

        for (const key of keys) {
            const filter = { _id: key as unknown as ObjectId };
            const data = await collection.findOne(filter);
            if (data) {
                result[key] = data;
            }
        }

        return result;
    }

    // Write data
    //TODO adicionar check para atualizar somente se existirem novos dados
    public async write(changes: { [key: string]: StoreItem }): Promise<void> {
        const collection = this.db.collection(this.collection);

        for (const key in changes) {
            const filter = { _id: key as unknown as ObjectId };
            const existingData = await collection.findOne(filter);
            let mergedData;

            if (existingData) {
                delete changes[key]._id;
                delete changes[key].eTags;
                mergedData = this.mergeObjects(existingData, changes[key] as object);
            } else {
                mergedData = changes[key];
            }

            await collection.updateOne(filter, { $set: mergedData }, { upsert: true });
        }
    }

    // Delete data
    public async delete(keys: string[]): Promise<void> {
        const collection = this.db.collection(this.collection);

        await collection.deleteMany({ _id: { $in: keys as unknown as readonly ObjectId[] } });
    }

    private mergeObjects = <T extends object = object>(target: T, ...sources: T[]): T => {
        if (!sources.length) {
            return target;
        }
        const source = sources.shift();
        if (source === undefined) {
            return target;
        }

        if (this.isMergebleObject(target) && this.isMergebleObject(source)) {
            Object.keys(source).forEach((key: string) => {
                if (this.isMergebleObject(source[key])) {
                    if (!target[key]) {
                        target[key] = {};
                    }
                    this.mergeObjects(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            });
        }

        return this.mergeObjects(target, ...sources);
    };

    private isObject = (item): boolean => {
        return item !== null && typeof item === 'object';
    };

    private isMergebleObject = (item): boolean => {
        return this.isObject(item) && !Array.isArray(item);
    };
}
