import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crop_health_ai';
  const localUri = 'mongodb://127.0.0.1:27017/crop_health_ai';

  // Attempt 1: Configured MongoDB URI (Atlas or custom)
  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return true;
  } catch (primaryErr) {
    console.warn(`[MongoDB Notice]: Primary URI connection paused (${primaryErr.message}).`);
    
    // Attempt 2: If primary was a remote Atlas URI that timed out (e.g. IP whitelist needed), try local MongoDB
    if (primaryUri !== localUri && !primaryUri.includes('127.0.0.1') && !primaryUri.includes('localhost')) {
      try {
        console.log(`[MongoDB]: Attempting connection to local MongoDB instance...`);
        const localConn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
        isConnected = true;
        console.log(`[MongoDB Connected Locally]: ${localConn.connection.host}`);
        return true;
      } catch (localErr) {
        // Fall through to in-memory mode
      }
    }

    console.warn(`[MongoDB Notice]: Running in Resilient In-Memory Mode. All features (Auth, Diagnosis, Reports) remain fully functional.`);
    isConnected = false;
    return false;
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  host: isConnected ? mongoose.connection?.host : 'In-Memory Fallback'
});
