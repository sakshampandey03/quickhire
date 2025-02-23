const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
console.log(process.env.MONGODB_URL);
const connect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connect };


