import {Pool, PoolClient} from 'pg';

let pool: Pool;
let pg: Promise<PoolClient>;

if (process.env.NODE_ENV === 'production') {
    pool = new Pool({
        connectionString: process.env.POSTGRESQL_ADDON_URI,
        application_name: "$ daily_mephi",
    });
    // @ts-ignore
    pg = await pool.connect();
} else {
    // @ts-ignore
    if (!global.pool || !global.pg) {
        // @ts-ignore

        global.pool = new Pool({
            connectionString: process.env.POSTGRESQL_ADDON_URI,
            application_name: "$ daily_mephi",
            max: 1,
        });

        // @ts-ignore
        global.pg = global.pool.connect();
        console.log("created new pool and pg");

    }
    // @ts-ignore

    pg = global.pg;
}

export default pg;
