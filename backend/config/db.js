const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    
    // Quick check if URI is likely invalid (localhost without running DB) to skip wait
    if (uri && (uri.includes('127.0.0.1') || uri.includes('localhost'))) {
       // try connecting with short timeout
        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
            console.log(`MongoDB Connected: ${mongoose.connection.host}`);
            return;
        } catch (e) {
            console.log("Local URI failed, switching to persistent local DB...");
        }
    } else if (uri) {
        // Cloud URI - Attempt connect, but fallback if it fails too (e.g. bad credentials)
         try {
            const conn = await mongoose.connect(uri);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return;
        } catch (e) {
            console.log("Cloud URI failed, switching to persistent local DB...");
        }
    }

    // Default to Persistent Local DB
    console.log("Starting Persistent Local Database...");
    const path = require('path');
    const fs = require('fs');
    
    const dbPath = path.join(__dirname, '..', 'data', 'db');
    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
    }

    const mongod = await MongoMemoryServer.create({
        instance: {
            dbPath: dbPath,
            storageEngine: 'wiredTiger'
        }
    });
    uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`Persistent Local Database Connected: ${conn.connection.host}`);

  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
