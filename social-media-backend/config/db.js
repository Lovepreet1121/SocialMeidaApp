// social-media-backend/config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // These options are deprecated in newer Mongoose versions but often included for compatibility
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true, // Deprecated
            // useFindAndModify: false // Deprecated
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;