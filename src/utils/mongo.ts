import { MongoClient } from 'mongodb';
import * as config from 'config';
import { promisify } from 'util';
import { IMongoConfig, MONGODB } from '../config';

const connect = promisify<string, MongoClient>(MongoClient.connect);
let client: MongoClient;

/**
 * Creates new mongo client and returns db ref for the given name
 * @param name
 */
export async function getDb(name: string) {
  const mongoConfig = config.get(MONGODB) as IMongoConfig;
  if (client == null) {
    client = await connect(mongoConfig.url);
  }
  return client.db(name);
}
