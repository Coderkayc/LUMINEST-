import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { initMQTT } from './src/services/mqtt.service.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    initMQTT();

    app.listen(PORT, () => {
      console.log(`⚡ LUMINEST Backend active on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();