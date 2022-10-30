import {Pool, PoolClient} from 'pg';

// Create a pool of connections to the database
const pool = new Pool({
    connectionString: process.env.POSTGRESQL_URL,
});

// Export a function to get a client from the pool
export async function getClient(): Promise<PoolClient> {
    return await pool.connect();
}
