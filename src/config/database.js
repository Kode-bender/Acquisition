import 'dotenv/config';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Configure Neon for different environments
function configureneon() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Check if we're using Neon Local (development environment)
  if (isDevelopment && databaseUrl.includes('neon-local')) {
    // Configure for Neon Local proxy
    neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
    neonConfig.useSecureWebSocket = false;
    neonConfig.poolQueryViaFetch = true;
    
    console.log('Using Neon Local proxy for development');
  } else {
    // Configure for Neon Cloud (production)
    console.log('Using Neon Cloud database');
  }

  return neon(databaseUrl);
}

// Initialize the SQL client
const sql = configureneon();

// Initialize Drizzle ORM
const db = drizzle(sql);

// Test database connection
async function testConnection() {
  try {
    await sql`SELECT 1 as test`;
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

// Test connection on module load (only in production)
if (process.env.NODE_ENV === 'production') {
  testConnection();
}

export { db, sql, testConnection };
