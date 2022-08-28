import mongoose from 'mongoose';

const isDebugEnabled = process.env.MONGOOSE_DEBUG === 'true' || process.env.MONGOOSE_DEBUG === '1';
const mongodbDSN = process.env.MONGODB_DSN || 'mongodb://localhost/default';

const connectDatabase = (autoIndex = true) => {
  //Set up default mongoose connection
  mongoose.connect(mongodbDSN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex,
  });

  // Get Mongoose to use the global promise library
  mongoose.Promise = global.Promise;
  mongoose.set('debug', isDebugEnabled);

  //Get the default connection
  const db = mongoose.connection;

  //Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  return db;
};

export default connectDatabase;
