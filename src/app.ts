import express from 'express';
import { initServices } from './services';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { sequelize } from './db/config';
import Redis from 'ioredis';
import config from './config';
import { initializeRoutes } from './api/routes';

let redisClient: Redis;

export function initializeRedis(): Redis {
  if (!redisClient) {
    redisClient = new Redis(config.redis.url);
  }
  return redisClient;
}

export function getRedisClient(): Redis {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
}

export const app = express();

// Initialize Redis client
initializeRedis();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the backend service',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Path to the API docs
  apis: ['./src/api/routes/*.ts'], // files containing annotations
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS, logging, etc middleware can be added here
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// Initialize services
export const init = async () => {
  try {
    await initConnections();
    await initServices();
    console.log('All services initialized successfully');
    
    // Initialize routes after services are ready
    app.use('/api', initializeRoutes());
    
  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
};

// Initialize connections
async function initConnections() {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log('Database connection established');

    // Test Redis connection
    await redisClient.ping();
    console.log('Redis connection established');
  } catch (error) {
    console.error('Failed to initialize connections:', error);
    process.exit(1);
  }
}

// Initialize connections before starting server

export { redisClient }; // Export redis instance for use in other files

export default app;
