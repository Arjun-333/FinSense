const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  try {
    console.log("Starting MongoDB Memory Server...");
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log("MongoDB Memory Server Started!");
    console.log("MONGO_URI=" + uri);
    
    // Keep it running
    setInterval(() => {}, 1000);
  } catch (err) {
    console.error("Failed to start MongoMemoryServer:", err);
  }
})();
