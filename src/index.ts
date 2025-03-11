import 'dotenv/config';
import { app, init } from './app';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Initialize all services and connections
    await init();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
