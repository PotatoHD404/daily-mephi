import {Pool, PoolClient} from 'pg';

let pool: Pool;
let pg: Promise<PoolClient>;

if (process.env.NODE_ENV === 'production') {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        application_name: "$ daily_mephi",
    });
    // @ts-ignore
    pg = await pool.connect();
} else {
    // @ts-ignore
    if (!global.pool || !global.pg) {
        // @ts-ignore

        global.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            application_name: "$ daily_mephi",
            max: 1,
        });

         // @ts-ignore
        global.pool.on('error', e => {
            console.error('Database error', e);
            // @ts-ignore
            global.pool = null;
          });

        // @ts-ignore
        global.pg = global.pool.connect();
        console.log("created new pool and pg");
        
    }
    // @ts-ignore

    pg = global.pg;
}

export default pg;
