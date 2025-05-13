import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // allow global var across hot reloads
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In dev mode, use a global variable so we don't create multiple connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for each connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;