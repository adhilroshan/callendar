// MongoDB implementation using Mongoose
import mongoose, { Schema, Document, model, Model, connect } from 'mongoose';

// Basic interfaces for plain objects
export interface UserData {
  email: string;
  name: string;
  phoneNumber?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface EventAlertData {
  userId: string;
  eventId: string;
  alertedAt: Date;
}

// Document interfaces for Mongoose
interface UserDocument extends UserData, Document {}
interface EventAlertDocument extends EventAlertData, Document {}

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/callendar';

// Connection function
let cachedConnection: typeof mongoose | null = null;
let connectionPromise: Promise<typeof mongoose> | null = null;

async function connectToDatabase() {
  // This function will only run on the server
  if (typeof window !== 'undefined') {
    throw new Error('This function is meant to be run on the server only');
  }
  
  // Return existing connection if available
  if (cachedConnection) {
    return cachedConnection;
  }

  // Return in-progress connection attempt if one exists
  if (connectionPromise) {
    return connectionPromise;
  }

  // Create new connection promise
  connectionPromise = new Promise(async (resolve, reject) => {
    try {
      const connection = await connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // 5 seconds timeout
        socketTimeoutMS: 45000, // 45 seconds socket timeout
      });
      console.log('Connected to MongoDB');
      cachedConnection = connection;
      connectionPromise = null;
      resolve(connection);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      connectionPromise = null;
      reject(new Error('Unable to connect to database'));
    }
  });

  return connectionPromise;
}

// Define Schemas
const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phoneNumber: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String }
}, { timestamps: true });

const EventAlertSchema = new Schema<EventAlertDocument>({
  userId: { type: String, required: true },
  eventId: { type: String, required: true },
  alertedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Create or get models (handling Next.js hot reloading)
function getModels() {
  // Check if models are already defined to prevent model overwrite errors during hot reload
  const UserModel = mongoose.models.User as Model<UserDocument> || 
    model<UserDocument>('User', UserSchema);
  
  const EventAlertModel = mongoose.models.EventAlert as Model<EventAlertDocument> || 
    model<EventAlertDocument>('EventAlert', EventAlertSchema);
  
  return { UserModel, EventAlertModel };
}

// Helper to convert document to plain object with string id
const documentToPlainObject = <T>(doc: Document | null): (T & { id: string }) | null => {
  if (!doc) return null;
  
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    id: obj._id.toString(),
    _id: undefined
  };
};

// Database methods
export const db = {
  // User methods
  createUser: async (userData: UserData) => {
    await connectToDatabase();
    const { UserModel } = getModels();
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: userData.email });
    
    if (existingUser) {
      // Update existing user
      Object.assign(existingUser, userData);
      const savedUser = await existingUser.save();
      return documentToPlainObject<UserData>(savedUser);
    }
    
    // Create new user
    const newUser = new UserModel(userData);
    const savedUser = await newUser.save();
    return documentToPlainObject<UserData>(savedUser);
  },
  
  getUser: async (id: string) => {
    await connectToDatabase();
    const { UserModel } = getModels();
    const user = await UserModel.findById(id);
    return documentToPlainObject<UserData>(user);
  },
  
  getUserByEmail: async (email: string) => {
    await connectToDatabase();
    const { UserModel } = getModels();
    const user = await UserModel.findOne({ email });
    return documentToPlainObject<UserData>(user);
  },
  
  updateUser: async (id: string, userData: Partial<UserData>) => {
    await connectToDatabase();
    const { UserModel } = getModels();
    const user = await UserModel.findByIdAndUpdate(
      id, 
      userData, 
      { new: true, runValidators: true }
    );
    return documentToPlainObject<UserData>(user);
  },
  
  getUsers: async () => {
    await connectToDatabase();
    const { UserModel } = getModels();
    const users = await UserModel.find();
    return users.map(user => documentToPlainObject<UserData>(user));
  },
  
  // Event alert methods
  checkEventAlert: async (userId: string, eventId: string) => {
    await connectToDatabase();
    const { EventAlertModel } = getModels();
    const alert = await EventAlertModel.findOne({ userId, eventId });
    return !!alert;
  },
  
  markEventAlerted: async (userId: string, eventId: string) => {
    await connectToDatabase();
    const { EventAlertModel } = getModels();
    const newAlert = new EventAlertModel({ userId, eventId, alertedAt: new Date() });
    await newAlert.save();
    return true;
  }
}; 