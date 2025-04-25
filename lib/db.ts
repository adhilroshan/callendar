// This is a simple database implementation with persistence
// In a real application, you would use a persistent database like MongoDB, PostgreSQL, etc.

// Mark this module as server-only
import 'server-only';
import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection string - should be in environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/callendar';
const MONGODB_DB = process.env.MONGODB_DB || 'callendar';

// MongoDB types
interface User {
  _id?: ObjectId;
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  accessToken?: string;
  refreshToken?: string;
}

interface EventAlert {
  _id?: ObjectId;
  userId: string;
  eventId: string;
  alertedAt: Date;
}

// MongoDB client
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Global to maintain connection across hot reloads in development
if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable so the connection 
  // persists across hot reloads
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production, create a new connection
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

// Helper function to get MongoDB collections
async function getCollections() {
  const client = await clientPromise;
  const db = client.db(MONGODB_DB);
  
  return {
    users: db.collection<User>('users'),
    eventAlerts: db.collection<EventAlert>('eventAlerts')
  };
}

export const db = {
  // User methods
  createUser: async (userData: Omit<User, 'id' | '_id'>) => {
    const { users } = await getCollections();
    
    // Generate unique ID
    const id = new ObjectId().toString();
    
    // Check if user with this email already exists
    const existingUser = await users.findOne({ email: userData.email });
    
    if (existingUser) {
      // Update existing user
      const updatedUser = {
        ...existingUser,
        ...userData,
        id: existingUser.id
      };
      
      await users.updateOne(
        { email: userData.email },
        { $set: updatedUser }
      );
      
      return updatedUser;
    }
    
    // Create new user
    const newUser = {
      id,
      ...userData
    };
    
    await users.insertOne(newUser);
    return newUser;
  },
  
  getUser: async (id: string) => {
    const { users } = await getCollections();
    return users.findOne({ id });
  },
  
  getUserByEmail: async (email: string) => {
    const { users } = await getCollections();
    return users.findOne({ email });
  },
  
  updateUser: async (id: string, userData: Partial<User>) => {
    const { users } = await getCollections();
    
    // Exclude _id from updates if present
    const { _id, ...updateData } = userData;
    
    const result = await users.updateOne(
      { id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) return null;
    return users.findOne({ id });
  },
  
  getUsers: async () => {
    const { users } = await getCollections();
    return users.find({}).toArray();
  },
  
  // Event alert methods
  checkEventAlert: async (userId: string, eventId: string) => {
    const { eventAlerts } = await getCollections();
    const alert = await eventAlerts.findOne({ userId, eventId });
    return !!alert;
  },
  
  markEventAlerted: async (userId: string, eventId: string) => {
    const { eventAlerts } = await getCollections();
    
    await eventAlerts.insertOne({
      userId,
      eventId,
      alertedAt: new Date()
    });
    
    return true;
  }
}; 