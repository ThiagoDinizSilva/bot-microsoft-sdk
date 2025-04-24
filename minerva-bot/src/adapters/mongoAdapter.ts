import { MongoClient, Db } from 'mongodb';

class MongoAdapter {
    private static instance: MongoAdapter;
    private dbConnection: Db | null = null;
    private readonly uri: string;
    private readonly dbName: string;

    private constructor(uri: string, dbName: string) {
        this.uri = uri;
        this.dbName = dbName;
    }

    public static getInstance(uri: string, dbName: string): MongoAdapter {
        if (!MongoAdapter.instance) {
            MongoAdapter.instance = new MongoAdapter(uri, dbName);
        }
        return MongoAdapter.instance;
    }

    public async connect(): Promise<Db> {
        if (!this.dbConnection) {
            const client = new MongoClient(this.uri);
            await client.connect();
            this.dbConnection = client.db(this.dbName);
        }
        return this.dbConnection;
    }
}

export default MongoAdapter;
