const ydb = require("ydb-sdk");
const {
    Column, Driver, getCredentialsFromEnv, getLogger, TableDescription, TableIndex, Ydb
} = ydb;

const logger = getLogger({level: 'debug'});
const config = {
    dbName: process.env.YDB_DB_NAME,
    entryPoint: process.env.YDB_ENTRY_POINT,
}
const authService = getCredentialsFromEnv(config.entryPoint, config.dbName, logger);
const driver = new Driver(config.entryPoint, config.dbName, authService);

const ACCOUNTS_TABLE = 'accounts';
const SESSIONS_TABLE = 'sessions';
const USERS_TABLE = 'users';
const VERIFICATION_REQUESTS_TABLE = 'verification_requests';

async function createTables(session, logger) {
    logger.info('Dropping old tables...');
    await session.dropTable(ACCOUNTS_TABLE);
    await session.dropTable(SESSIONS_TABLE);
    await session.dropTable(USERS_TABLE);
    await session.dropTable(VERIFICATION_REQUESTS_TABLE);

    logger.info('Creating tables...');

    await session.createTable(
        ACCOUNTS_TABLE,
        new TableDescription()
            .withColumn(new Column(
                'compound_id',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'user_id',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'provider_type',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'provider_id',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'provider_account_id',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'refresh_token',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'access_token',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'access_token_expires',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UINT64}}})
            ))
            .withColumn(new Column(
                'created_at',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UINT64}}})
            ))
            .withColumn(new Column(
                'updated_at',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UINT64}}})
            ))
            .withPrimaryKey('compound_id')
            .withIndexes(
                new TableIndex('accounts_provider_account_id')
                    .withIndexColumns('provider_id', 'provider_account_id'),
                new TableIndex('accounts_user_id')
                    .withIndexColumns('user_id')
            )
    );

    await session.createTable(
        SESSIONS_TABLE,
        new TableDescription()
            .withColumn(new Column(
                'session_token',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'user_id',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'expires',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UINT64}}})
            ))
            .withColumn(new Column(
                'access_token',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'created_at',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UINT64}}})
            ))
            .withColumn(new Column(
                'updated_at',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UINT64}}})
            ))
            .withPrimaryKey('session_token')
            .withIndexes(
                new TableIndex('sessions_access_token')
                    .withIndexColumns('access_token'),
                new TableIndex('sessions_user_id')
                    .withIndexColumns('user_id')
            )
    );

    await session.createTable(
        USERS_TABLE,
        new TableDescription()
            .withColumn(new Column(
                'id',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'name',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'email',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'email_verified',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UINT64}}})
            ))
            .withColumn(new Column(
                'image',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'created_at',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UINT64}}})
            ))
            .withColumn(new Column(
                'updated_at',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UINT64}}})
            ))
            .withPrimaryKey('id')
            .withIndexes(
                new TableIndex('users_email')
                    .withIndexColumns('email'),
            )
    );

    await session.createTable(
        VERIFICATION_REQUESTS_TABLE,
        new TableDescription()
            .withColumn(new Column(
                'token',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'identifier',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UTF8}}})
            ))
            .withColumn(new Column(
                'expires',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UINT64}}})
            ))
            .withColumn(new Column(
                'created_at',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UINT64}}})
            ))
            .withColumn(new Column(
                'updated_at',
                Ydb.Type.create({optionalType: {item: {typeId: Ydb.Type.PrimitiveTypeId.UINT64}}})
            ))
            .withPrimaryKey('token')
    );
}

async function describeTable(session, tableName, logger) {
    logger.info(`Describing table: ${tableName}`);
    const result = await session.describeTable(tableName);
    for (const column of result.columns) {
        logger.info(`Column name '${column.name}' has type ${JSON.stringify(column.type)}`);
    }
}

(async () => {
    await driver.tableClient.withSession(async (session) => {
        await createTables(session, logger);
        for (t of [ACCOUNTS_TABLE, SESSIONS_TABLE, USERS_TABLE, VERIFICATION_REQUESTS_TABLE]) {
            await describeTable(session, t, logger);
        }
    });
})()
