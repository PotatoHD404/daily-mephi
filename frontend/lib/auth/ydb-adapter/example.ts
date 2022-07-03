// import {declareType, Driver, getCredentialsFromEnv, getLogger, TypedData, withRetries, Ydb} from "ydb-sdk";
// import {DateTime} from "luxon";
// import {v4 as uuid4} from 'uuid';
// import image from "next/image";
//
// const Type = Ydb.Type;
//
// interface IUser {
//     id: string;
//     name: string;
//     email: string;
//     emailVerified: number;
//     image: string;
//     createdAt: number;
//     updatedAt: number;
// }
//
// export class User extends TypedData {
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     public id: string;
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     public name: string;
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     public email: string;
//     @declareType({optionalType: {item: {typeId: Type.PrimitiveTypeId.UINT64}}})
//     public emailVerified: number;
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     public image: string;
//     @declareType({typeId: Type.PrimitiveTypeId.UINT64})
//     public createdAt: number;
//     @declareType({typeId: Type.PrimitiveTypeId.UINT64})
//     public updatedAt: number;
//
//     static create(
//         {
//             name, email, image, emailVerified,
//             createdAt = DateTime.local().toMillis(),
//             updatedAt = DateTime.local().toMillis(),
//             id = uuid4()
//         }) {
//         return new User({
//             name, email, image, emailVerified,
//             id,
//             createdAt,
//             updatedAt
//         })
//     }
//
//     constructor(data: IUser) {
//         super(data);
//         this.id = data.id;
//         this.name = data.name;
//         this.email = data.email;
//         this.emailVerified = data.emailVerified;
//         this.image = data.image;
//         this.createdAt = data.createdAt;
//         this.updatedAt = data.updatedAt;
//     }
// }
//
// const config = {
//     loglevel: 'debug',
//     dbName: process.env.YDB_DB_NAME,
//     entryPoint: process.env.YDB_ENTRY_POINT,
// };
//
// function addTablePrefix(tablePathPrefix) {
//     return (strings: TemplateStringsArray) => `PRAGMA TablePathPrefix("${tablePathPrefix}");\n` + strings.join(' ');
// }
//
//
// (async () => {
//     const logger = getLogger({level: config.loglevel || 'debug'});
//     const authService = getCredentialsFromEnv(config.entryPoint, config.dbName, logger);
//     const driver = new Driver(config.entryPoint, config.dbName, authService);
//     const yql = addTablePrefix(config.dbName);
//
//     const insertUserStructQuery = yql`
//         DECLARE $users AS List<Struct<id: Utf8,
//         name: Utf8,
//         email: Utf8,
//         email_verified: Optional<Uint64>,
//         image: Utf8,
//         created_at: Uint64,
//         updated_at: Uint64>>;
//
//         REPLACE INTO users
//         SELECT
//             id, name, email, email_verified, image, created_at, updated_at
//         FROM AS_TABLE($users)`;
//
//     async function createUser(profile) {
//         logger.debug({profile}, 'CREATE_USER')
//         try {
//             const user = User.create(
//                 {
//                     name: profile.name,
//                     email: profile.email,
//                     image: profile.image,
//                     emailVerified: profile.emailVerified ? DateTime.fromJSDate(profile.emailVerified).toMillis() : null
//                 }
//             );
//
//             await driver.tableClient.withSession(async (session) => {
//                 const txMeta = await session.beginTransaction({serializableReadWrite: {}});
//                 const preparedInsert = await session.prepareQuery(insertUserStructQuery);
//                 const txId = txMeta.id as string;
//                 logger.info({users: User.asTypedCollection([user])}, 'GOT')
//                 const insert = async () => {
//                     await session.executeQuery(preparedInsert, {
//                         '$users': User.asTypedCollection([user])
//                     }, {txId});
//                 }
//                 await withRetries(insert);
//                 await session.commitTransaction({txId});
//
//             });
//             return user;
//         } catch (error) {
//             logger.error({error}, 'CREATE_USER_ERROR')
//             return Promise.reject(error)
//         }
//     }
//
//     await createUser({
//         name: 'name',
//         email: 'email',
//         image: 'image',
//         emailVerified: null
//     })
// })()