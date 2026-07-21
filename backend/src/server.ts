import { app } from '#/app.js';
import { env } from '#/config/env.js';
import { prisma } from '#/prisma/client.js';

async function startServer() {
  console.log('========================================');
  console.log('Starting backend...');
  console.log('========================================');
  
  try {
    // Connect to database
    console.log('Loading environment...');
    console.log('Connecting to PostgreSQL...');
    
    await prisma.$connect();
    console.log('✓ Prisma Client initialized.');
    console.log('✓ Database connected successfully.');
    
    // Start Express server
    const server = app.listen(env.port, () => {
      console.log('========================================');
      console.log('Environment Loaded');
      console.log(`Node: ${env.nodeEnv}`);
      console.log(`Port: ${env.port}`);
      console.log('Database: PostgreSQL');
      console.log('Prisma: Connected');
      console.log('========================================');
      console.log(`🚀 API listening on port ${env.port}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      
      server.close(async () => {
        console.log('Closing HTTP server...');
        
        try {
          await prisma.$disconnect();
          console.log('✓ Prisma disconnected.');
          console.log('✓ Shutdown complete.');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (error) {
    console.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
