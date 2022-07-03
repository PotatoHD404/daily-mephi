// import {Driver, getCredentialsFromEnv, getLogger, Logger, withRetries, Ydb} from 'ydb-sdk';
// import {uuid4} from "uuid";
// import {createHash, randomBytes} from 'crypto'
// import {AppOptions} from "next-auth";
// import {CreateUserError} from "./errors/CreateUserError";
// import {AccountData, Session, SessionData, UserData, VerificationRequestData} from "lib/auth/ydb-adapter/models";
// import {typedUtf8} from "lib/auth/ydb-adapter/dbHelpers";
// import {BaseError} from "./errors/BaseError";
// import {DateTime} from "luxon";
// import Long from "long";
//
// interface YdbAdapterConfig {
//     loglevel: 'debug' | 'info',
//     entryPoint: string,
//     dbName: string,
// }
//
// function addTablePrefix(tablePathPrefix) {
//     return (strings: TemplateStringsArray) => `PRAGMA TablePathPrefix("${tablePathPrefix}");\n` + strings.join(' ');
// }
//
// function getHashedToken(token, secret) {
//     return createHash('sha256')
//         .update(`${token}${secret}`)
//         .digest('hex');
// }
//
// export const YdbAdapter = (config: YdbAdapterConfig, options = {}) => {
//     function getCompoundId(providerId, providerAccountId) {
//         return createHash('sha256').update(`${providerId}:${providerAccountId}`).digest('hex')
//     }
//
//     async function getAdapter(appOptions: AppOptions) {
//         const logger = getLogger({level: config.loglevel || 'debug'});
//         const authService = getCredentialsFromEnv(config.entryPoint, config.dbName, logger);
//         const driver = new Driver(config.entryPoint, config.dbName, authService);
//         const yql = addTablePrefix(config.dbName);
//
//         if (appOptions && (!appOptions.session || !appOptions.session.maxAge)) {
//             logger.debug({message: 'Session expiry not configured (defaulting to 30 days)'}, 'GET_ADAPTER')
//         }
//
//         const defaultSessionMaxAge = 30 * 24 * 60 * 60 * 1000
//         const sessionMaxAge = (appOptions && appOptions.session && appOptions.session.maxAge)
//             ? appOptions.session.maxAge * 1000
//             : defaultSessionMaxAge
//         const sessionUpdateAge = (appOptions && appOptions.session && appOptions.session.updateAge)
//             ? appOptions.session.updateAge * 1000
//             : 0
//
//         const selectUserByEmailQuery = yql`DECLARE $email AS Utf8;
//                     SELECT *
//                     FROM users VIEW users_email
//                     WHERE email = $email;`;
//
//         const selectUserByIdQuery = yql`DECLARE $id AS Utf8;
//                     SELECT *
//                     FROM users
//                     WHERE id = $id;`;
//
//         const selectUserByProviderAccountId = yql`
//                     PRAGMA SimpleColumns;
//
//                     DECLARE $provider_id AS Utf8;
//                     DECLARE $provider_account_id AS Utf8;
//
//                     SELECT u.*
//                     FROM accounts VIEW accounts_provider_account_id AS a
//                     JOIN users AS u ON a.user_id = u.id
//                     WHERE a.provider_id = $provider_id
//                     AND a.provider_account_id = $provider_account_id;`;
//
//         const updateUserQuery = yql`
//                     DECLARE $id AS Utf8;
//                     DECLARE $name AS Utf8?;
//                     DECLARE $email AS Utf8;
//                     DECLARE $email_verified AS Uint64?;
//                     DECLARE $image AS Utf8?;
//                     DECLARE $updated_at AS Uint64;
//
//                     UPDATE users
//                     SET name = $name,
//                       email = $email,
//                       email_verified = $email_verified,
//                       image = $image,
//                       updated_at = $updated_at
//                     WHERE id = $id`;
//
//         const insertUserStructQuery = yql`
//                     DECLARE $users AS List<Struct<id: Utf8,
//                     name: Utf8?,
//                     email: Utf8,
//                     email_verified: Uint64?,
//                     image: Utf8?,
//                     created_at: Uint64,
//                     updated_at: Uint64>>;
//
//                     REPLACE INTO users
//                     SELECT
//                         id, name, email, email_verified, image, created_at, updated_at
//                     FROM AS_TABLE($users)`;
//
//         const deleteUserQuery = yql`
//                     DECLARE $id AS Utf8;
//
//                     DELETE FROM users
//                     WHERE id = $id`;
//
//         const insertAccountQuery = yql`
//                     DECLARE $compound_id AS Utf8;
//                     DECLARE $user_id AS Utf8;
//                     DECLARE $provider_type AS Utf8;
//                     DECLARE $provider_id AS Utf8;
//                     DECLARE $provider_account_id AS Utf8;
//                     DECLARE $refresh_token AS Utf8?;
//                     DECLARE $access_token AS Utf8;
//                     DECLARE $access_token_expires AS Uint64?;
//                     DECLARE $created_at AS Uint64;
//                     DECLARE $updated_at AS Uint64;
//
//                     INSERT INTO accounts (compound_id, user_id, provider_type, provider_id, provider_account_id,
//                      refresh_token, access_token, access_token_expires, created_at, updated_at)
//                     VALUES ($compound_id, $user_id, $provider_type, $provider_id, $provider_account_id,
//                      $refresh_token, $access_token, $access_token_expires, $created_at, $updated_at)`;
//
//         const insertSessionQuery = yql`
//                     DECLARE $session_token AS Utf8;
//                     DECLARE $user_id AS Utf8;
//                     DECLARE $expires AS Uint64;
//                     DECLARE $access_token AS Utf8;
//                     DECLARE $created_at AS Uint64;
//                     DECLARE $updated_at AS Uint64;
//
//                     INSERT INTO sessions (session_token, user_id, expires, access_token, created_at, updated_at)
//                     VALUES ($session_token, $user_id, $expires, $access_token, $created_at, $updated_at)`;
//
//         const deleteAccountQuery = yql`
//                     DECLARE $compound_id AS Utf8;
//
//                     DELETE FROM accounts
//                     WHERE compound_id = $compound_id`;
//
//         const selectSessionByTokenQuery = yql`DECLARE $session_token AS Utf8;
//                     SELECT *
//                     FROM sessions
//                     WHERE session_token = $session_token;`;
//
//         const deleteSessionByTokenQuery = yql`
//                     DECLARE $session_token AS Utf8;
//
//                     DELETE FROM sessions
//                     WHERE session_token = $session_token;`;
//
//         const updateSessionQuery = yql`
//                     DECLARE $session_token AS Utf8;
//                     DECLARE $expires AS Uint64;
//                     DECLARE $updated_at AS Uint64;
//
//                     UPDATE sessions
//                     SET expires= $expires,
//                         updated_at = $updated_at
//                     WHERE session_token= $session_token;`;
//
//         const insertVerificationRequestQuery = yql`
//                     DECLARE $token AS Utf8;
//                     DECLARE $identifier AS Utf8;
//                     DECLARE $expires AS Uint64;
//                     DECLARE $created_at AS Uint64;
//                     DECLARE $updated_at AS Uint64;
//
//                     INSERT INTO verification_requests (token, identifier, expires, created_at, updated_at)
//                     VALUES ($token, $identifier, $expires, $created_at, $updated_at)`;
//
//         const selectVerificationRequestQuery = yql`
//                     PRAGMA SimpleColumns;
//
//                     DECLARE $token AS Utf8;
//
//                     SELECT *
//                     FROM verification_requests
//                     WHERE token = $token;`;
//
//         const deleteVerificationRequestQuery = yql`
//                     DECLARE $token AS Utf8;
//
//                     DELETE FROM verification_requests
//                     WHERE token = $token;`;
//
//         async function createUser(profile) {
//             logger.debug({profile}, 'CREATE_USER')
//             try {
//                 const user = UserData.create(
//                     {
//                         name: profile.name,
//                         email: profile.email,
//                         image: profile.image,
//                         emailVerified: profile.emailVerified ? DateTime.fromJSDate(profile.emailVerified).toMillis() : null
//                     }
//                 );
//
//                 await driver.tableClient.withSession(async (session) => {
//                     const txMeta = await session.beginTransaction({serializableReadWrite: {}});
//                     const preparedSelect = await session.prepareQuery(selectUserByEmailQuery);
//                     const preparedInsert = await session.prepareQuery(insertUserStructQuery);
//                     const txId = txMeta.id as string;
//
//                     const select = async () => {
//                         const {resultSets} = await session.executeQuery(preparedSelect, {
//                             '$email': user.getTypedValue('email'),
//                         }, {txId});
//                         return UserData.createNativeObjects(resultSets[0]);
//                     }
//                     const data = await withRetries(select) as UserData[];
//                     const userFromDb = data[0];
//                     logger.debug({users: UserData.asTypedCollection([user])}, "users");
//                     if (userFromDb) {
//                         throw new CreateUserError("User with this email already created");
//                     }
//                     const insert = async () => {
//                         await session.executeQuery(preparedInsert, {
//                             '$users': UserData.asTypedCollection([user])
//                         }, {txId});
//                     }
//                     await withRetries(insert);
//                     await session.commitTransaction({txId});
//
//                 });
//                 return user.toNative();
//             } catch (error) {
//                 logger.error({error}, 'CREATE_USER_ERROR')
//                 return Promise.reject(new CreateUserError(error))
//             }
//         }
//
//         async function getUser(id) {
//             logger.debug({id}, 'GET_USER')
//             try {
//                 return await driver.tableClient.withSession(async (session) => {
//                     const preparedSelect = await session.prepareQuery(selectUserByIdQuery);
//
//                     const select = async () => {
//                         const {resultSets} = await session.executeQuery(preparedSelect, {
//                             '$id': typedUtf8(id),
//                         });
//                         return UserData.createNativeObjects(resultSets[0])
//                     }
//                     const data = await withRetries(select) as UserData[];
//                     const userFromDb = data[0];
//                     if (!userFromDb) {
//                         throw new Error(`User ${id} not found`);
//                     }
//                     return userFromDb.toNative();
//                 });
//             } catch (error) {
//                 logger.error({error}, 'GET_USER_BY_ID_ERROR')
//                 return Promise.reject(new BaseError('GET_USER_BY_ID_ERROR', error))
//             }
//         }
//
//         async function getUserByEmail(email) {
//             logger.debug({email}, 'GET_USER_BY_EMAIL')
//             if (!email) {
//                 return Promise.resolve(null)
//             }
//             try {
//                 return await driver.tableClient.withSession(async (session) => {
//                     const preparedSelect = await session.prepareQuery(selectUserByEmailQuery);
//
//                     const select = async () => {
//                         const {resultSets} = await session.executeQuery(preparedSelect, {
//                             '$email': typedUtf8(email),
//                         });
//                         return UserData.createNativeObjects(resultSets[0])
//                     }
//                     const data = await withRetries(select) as UserData[];
//                     const userFromDb = data[0];
//                     if (!userFromDb) {
//                         return null;
//                     }
//                     return userFromDb.toNative();
//                 });
//             } catch (error) {
//                 logger.error({error}, 'GET_USER_BY_EMAIL_ERROR')
//                 return Promise.reject(new BaseError('GET_USER_BY_EMAIL_ERROR', error))
//             }
//         }
//
//         async function getUserByProviderAccountId(
//             providerId,
//             providerAccountId
//         ) {
//             logger.debug({providerId, providerAccountId}, 'GET_USER_BY_PROVIDER_ACCOUNT_ID')
//             try {
//                 return await driver.tableClient.withSession(async (session) => {
//                     const preparedSelect = await session.prepareQuery(selectUserByProviderAccountId);
//
//                     const select = async () => {
//                         const {resultSets} = await session.executeQuery(preparedSelect, {
//                             '$provider_id': typedUtf8(providerId),
//                             '$provider_account_id': typedUtf8(providerAccountId),
//                         });
//                         return UserData.createNativeObjects(resultSets[0])
//                     }
//                     const data = await withRetries(select) as UserData[];
//                     const userFromDb = data[0];
//                     if (!userFromDb) {
//                         return null;
//                     }
//                     return userFromDb.toNative();
//                 });
//             } catch (error) {
//                 logger.error({error}, 'GET_USER_BY_PROVIDER_ACCOUNT_ID_ERROR')
//                 return Promise.reject(new BaseError('GET_USER_BY_PROVIDER_ACCOUNT_ID_ERROR', error))
//             }
//         }
//
//         async function getUserByCredentials(credentials) {
//             logger.debug({credentials}, 'GET_USER_BY_CREDENTIALS')
//
//             return Promise.reject(new BaseError('NOT_IMPLEMENTED', "getUserByCredentials is not implemented"))
//         }
//
//         async function updateUser(profile) {
//             logger.debug({profile}, 'UPDATE_USER')
//             const user = UserData.create(
//                 {
//                     id: profile.id,
//                     name: profile.name,
//                     email: profile.email,
//                     image: profile.image,
//                     emailVerified: profile.emailVerified ? DateTime.fromJSDate(profile.emailVerified).toMillis() : null,
//                     createdAt: profile.createdAt,
//                 }
//             );
//             try {
//                 return await driver.tableClient.withSession(async (session) => {
//                     const preparedUpdate = await session.prepareQuery(updateUserQuery);
//
//                     const update = async () => {
//                         await session.executeQuery(preparedUpdate, {
//                             '$id': user.getTypedValue('id'),
//                             '$name': user.getTypedValue('name'),
//                             '$email': user.getTypedValue('email'),
//                             '$email_verified': user.getTypedValue('emailVerified'),
//                             '$image': user.getTypedValue('image'),
//                             '$updated_at': user.getTypedValue('updatedAt'),
//                         },);
//                     }
//                     await withRetries(update);
//                     return user.toNative();
//                 });
//             } catch (error) {
//                 logger.error({error}, 'UPDATE_USER_ERROR')
//                 return Promise.reject(new BaseError('UPDATE_USER_ERROR', error))
//             }
//         }
//
//         async function deleteUser(userId) {
//             logger.debug({userId}, 'DELETE_USER')
//             try {
//                 return await driver.tableClient.withSession(async (session) => {
//                     const preparedDelete = await session.prepareQuery(deleteUserQuery);
//
//                     const del = async () => {
//                         await session.executeQuery(preparedDelete, {
//                             '$id': typedUtf8(userId),
//                         });
//                         return null
//                     }
//                     await withRetries(del);
//                     return null;
//                 });
//             } catch (error) {
//                 logger.error({error}, 'DELETE_USER_ERROR')
//                 return Promise.reject(new BaseError('DELETE_USER_ERROR', error))
//             }
//         }
//
//         async function linkAccount(
//             userId,
//             providerId,
//             providerType,
//             providerAccountId,
//             refreshToken,
//             accessToken,
//             accessTokenExpires
//         ) {
//             logger.debug({
//                 userId,
//                 providerId,
//                 providerType,
//                 providerAccountId,
//                 refreshToken,
//                 accessToken,
//                 accessTokenExpires
//             }, 'LINK_ACCOUNT')
//             try {
//                 const account = new AccountData({
//                     accessToken,
//                     accessTokenExpires,
//                     compoundId: getCompoundId(providerId, providerAccountId),
//                     createdAt: DateTime.local().toMillis(),
//                     providerAccountId,
//                     providerId,
//                     providerType,
//                     refreshToken,
//                     updatedAt: DateTime.local().toMillis(),
//                     userId
//                 });
//                 logger.debug({account}, 'ACCOUNT_DATA');
//                 return await driver.tableClient.withSession(async (session) => {
//                     const preparedInsert = await session.prepareQuery(insertAccountQuery);
//
//                     const insert = async () => {
//                         await session.executeQuery(preparedInsert, {
//                             '$compound_id': account.getTypedValue('compoundId'),
//                             '$user_id': account.getTypedValue('userId'),
//                             '$provider_type': account.getTypedValue('providerType'),
//                             '$provider_id': account.getTypedValue('providerId'),
//                             '$provider_account_id': account.getTypedValue('providerAccountId'),
//                             '$refresh_token': account.getTypedValue('refreshToken'),
//                             '$access_token': account.getTypedValue('accessToken'),
//                             '$access_token_expires': account.getTypedValue('accessTokenExpires'),
//                             '$created_at': account.getTypedValue('createdAt'),
//                             '$updated_at': account.getTypedValue('updatedAt'),
//                         });
//                     }
//                     await withRetries(insert);
//                     return account.toNative();
//                 });
//
//             } catch (error) {
//                 logger.error({error}, 'LINK_ACCOUNT_ERROR')
//                 return Promise.reject(new CreateUserError(error))
//             }
//         }
//
//         async function unlinkAccount(
//             userId,
//             providerId,
//             providerAccountId
//         ) {
//             logger.debug({userId, providerId, providerAccountId}, 'UNLINK_ACCOUNT')
//             try {
//                 return await driver.tableClient.withSession(async (session) => {
//                     const preparedDelete = await session.prepareQuery(deleteAccountQuery);
//
//                     const del = async () => {
//                         await session.executeQuery(preparedDelete, {
//                             '$compound_id': typedUtf8(getCompoundId(providerId, providerAccountId)),
//                         });
//                         return null
//                     }
//                     await withRetries(del);
//                     return null;
//                 });
//             } catch (error) {
//                 logger.error({error}, 'UNLINK_ACCOUNT_ERROR')
//                 return Promise.reject(new BaseError('UNLINK_ACCOUNT_ERROR', error))
//             }
//         }
//
//         async function createSession(user) {
//             logger.debug({user}, 'CREATE_SESSION')
//             try {
//                 let expires = null
//                 const now = DateTime.local()
//                 if (sessionMaxAge) {
//                     const dateExpires = now.plus({milliseconds: sessionMaxAge})
//                     expires = dateExpires.toMillis()
//                 }
//                 const session = new SessionData({
//                     accessToken: randomBytes(32).toString('hex').toString(),
//                     createdAt: now.toMillis(),
//                     expires,
//                     sessionToken: randomBytes(32).toString('hex').toString(),
//                     updatedAt: now.toMillis(),
//                     userId: user.id
//                 })
//
//                 await driver.tableClient.withSession(async (dbSession) => {
//                     const preparedInsert = await dbSession.prepareQuery(insertSessionQuery);
//
//                     const insert = async () => {
//                         await dbSession.executeQuery(preparedInsert, {
//                             '$session_token': session.getTypedValue('sessionToken'),
//                             '$user_id': session.getTypedValue('userId'),
//                             '$expires': session.getTypedValue('expires'),
//                             '$access_token': session.getTypedValue('accessToken'),
//                             '$created_at': session.getTypedValue('createdAt'),
//                             '$updated_at': session.getTypedValue('updatedAt'),
//                         });
//                     }
//                     return await withRetries(insert);
//                 });
//                 return session.toNative();
//
//             } catch (error) {
//                 logger.error('CREATE_SESSION_ERROR', error)
//                 return Promise.reject(new BaseError('CREATE_SESSION_ERROR', error))
//             }
//         }
//
//         async function getSession(sessionToken): Promise<Session> {
//             logger.debug({sessionToken}, 'GET_SESSION')
//             try {
//                 return await driver.tableClient.withSession(async (session) => {
//                     const txMeta = await session.beginTransaction({serializableReadWrite: {}});
//                     const preparedSelect = await session.prepareQuery(selectSessionByTokenQuery);
//                     const preparedDelete = await session.prepareQuery(deleteSessionByTokenQuery);
//                     const txId = txMeta.id as string;
//
//                     const select = async () => {
//                         const {resultSets} = await session.executeQuery(preparedSelect, {
//                             '$session_token': typedUtf8(sessionToken),
//                         }, {txId});
//                         return SessionData.createNativeObjects(resultSets[0])
//                     }
//                     const del = async () => {
//                         await session.executeQuery(preparedDelete, {
//                             '$session_token': typedUtf8(sessionToken),
//                         }, {txId});
//                     }
//                     const data = await withRetries(select) as SessionData[];
//                     const sessionObj = data[0];
//                     // Check session has not expired (do not return it if it has)
//                     if (sessionObj && sessionObj.expires && DateTime.local().toMillis() > sessionObj.expires.toNumber()) {
//                         await withRetries(del)
//                         return null
//                     }
//                     return sessionObj.toNative();
//                 });
//             } catch (error) {
//                 logger.error('GET_SESSION_ERROR', error)
//                 return Promise.reject(new BaseError('GET_SESSION_ERROR', error))
//             }
//         }
//
//         async function updateSession(
//             session: Session,
//             force
//         ): Promise<Session> {
//             logger.debug({session}, 'UPDATE_SESSION')
//             try {
//                 const now = DateTime.local();
//                 const sessionData = new SessionData(session);
//                 if (sessionMaxAge && (sessionUpdateAge || sessionUpdateAge === 0) && session.expires) {
//                     // Calculate last updated date, to throttle write updates to database
//                     // Formula: ({expiry date} - sessionMaxAge) + sessionUpdateAge
//                     //     e.g. ({expiry date} - 30 days) + 1 hour
//                     //
//                     // Default for sessionMaxAge is 30 days.
//                     // Default for sessionUpdateAge is 1 hour.
//                     const dateSessionIsDueToBeUpdated = DateTime.fromJSDate(session.expires)
//                         .minus({milliseconds: sessionMaxAge})
//                         .plus({milliseconds: sessionUpdateAge});
//
//                     // Trigger update of session expiry date and write to database, only
//                     // if the session was last updated more than {sessionUpdateAge} ago
//                     const now = DateTime.local();
//                     if (now > dateSessionIsDueToBeUpdated) {
//                         const newExpiryDate = now.plus({milliseconds: sessionMaxAge})
//                         sessionData.expires = Long.fromInt(newExpiryDate.toMillis());
//                     } else if (!force) {
//                         return null
//                     }
//                 } else {
//                     // If session MaxAge, session UpdateAge or session.expires are
//                     // missing then don't even try to save changes, unless force is set.
//                     if (!force) {
//                         return null
//                     }
//                 }
//
//                 sessionData.updatedAt = Long.fromInt(now.toMillis());
//
//                 return await driver.tableClient.withSession(async (dbSession) => {
//                     const preparedInsert = await dbSession.prepareQuery(updateSessionQuery);
//
//                     const insert = async () => {
//                         await dbSession.executeQuery(preparedInsert, {
//                             '$session_token': sessionData.getTypedValue('sessionToken'),
//                             '$expires': sessionData.getTypedValue('expires'),
//                             '$updated_at': sessionData.getTypedValue('updatedAt'),
//                         });
//                     }
//                     await withRetries(insert);
//                     return sessionData.toNative();
//                 });
//             } catch (error) {
//                 logger.error('UPDATE_SESSION_ERROR', error)
//                 return Promise.reject(new BaseError('UPDATE_SESSION_ERROR', error))
//             }
//         }
//
//         async function deleteSession(sessionToken) {
//             logger.debug({sessionToken}, 'DELETE_SESSION')
//             try {
//                 return await driver.tableClient.withSession(async (session) => {
//                     const preparedDelete = await session.prepareQuery(deleteSessionByTokenQuery);
//
//                     const del = async () => {
//                         await session.executeQuery(preparedDelete, {
//                             '$session_token': typedUtf8(sessionToken),
//                         });
//                         return null
//                     }
//                     await withRetries(del);
//                     return null;
//                 });
//             } catch (error) {
//                 logger.error({error}, 'DELETE_SESSION_ERROR')
//                 return Promise.reject(new BaseError('DELETE_SESSION_ERROR', error))
//             }
//         }
//
//         async function createVerificationRequest(
//             identifier,
//             url,
//             token,
//             secret,
//             provider
//         ) {
//             if (!identifier) {
//                 return null;
//             }
//             logger.debug({
//                 identifier,
//                 url,
//                 provider
//             }, 'CREATE_VERIFICATION_REQUEST')
//             try {
//                 const {baseUrl} = appOptions
//                 const {sendVerificationRequest, maxAge} = provider
//
//                 // Store hashed token (using secret as salt) so that tokens cannot be exploited
//                 // even if the contents of the database is compromised.
//                 // @TODO Use bcrypt function here instead of simple salted hash
//                 const hashedToken = getHashedToken(token, secret);
//
//                 let expires = null
//                 const now = DateTime.local();
//                 if (maxAge) {
//                     const dateExpires = now.plus({seconds: maxAge})
//                     expires = dateExpires.toMillis();
//                 }
//
//                 const verificationRequest = new VerificationRequestData({
//                     createdAt: now.toMillis(),
//                     expires,
//                     identifier,
//                     token: hashedToken,
//                     updatedAt: now.toMillis(),
//                 })
//                 logger.debug({verificationRequest})
//                 // Save to database
//                 await driver.tableClient.withSession(async (dbSession) => {
//                     const preparedInsert = await dbSession.prepareQuery(insertVerificationRequestQuery);
//
//                     const insert = async () => {
//                         await dbSession.executeQuery(preparedInsert, {
//                             '$token': verificationRequest.getTypedValue('token'),
//                             '$identifier': verificationRequest.getTypedValue('identifier'),
//                             '$expires': verificationRequest.getTypedValue('expires'),
//                             '$created_at': verificationRequest.getTypedValue('createdAt'),
//                             '$updated_at': verificationRequest.getTypedValue('updatedAt'),
//                         });
//                     }
//                     return await withRetries(insert);
//                 });
//
//                 // With the verificationCallback on a provider, you can send an email, or queue
//                 // an email to be sent, or perform some other action (e.g. send a text message)
//                 await sendVerificationRequest({identifier, url, token, baseUrl, provider})
//
//                 return verificationRequest.toNative();
//             } catch (error) {
//                 logger.error('CREATE_VERIFICATION_REQUEST_ERROR', error)
//                 return Promise.reject(new Error('CREATE_VERIFICATION_REQUEST_ERROR'))
//             }
//         }
//
//         async function getVerificationRequest(
//             identifier,
//             token,
//             secret,
//             provider
//         ) {
//             logger.debug({identifier}, 'GET_VERIFICATION_REQUEST')
//             try {
//                 const hashedToken = getHashedToken(token, secret);
//                 const now = DateTime.local()
//
//                 return await driver.tableClient.withSession(async (session) => {
//                     const preparedSelect = await session.prepareQuery(selectVerificationRequestQuery);
//
//                     const select = async () => {
//                         const {resultSets} = await session.executeQuery(preparedSelect, {
//                             '$token': typedUtf8(hashedToken),
//                         });
//                         return VerificationRequestData.createNativeObjects(resultSets[0])
//                     }
//                     const data = await withRetries(select) as VerificationRequestData[];
//                     const vr = data[0];
//                     if (vr && vr.expires && now.toMillis() > vr.expires.toNumber()) {
//                         // Delete verification entry so it cannot be used again
//                         const preparedDelete = await session.prepareQuery(deleteVerificationRequestQuery);
//
//                         const del = async () => {
//                             await session.executeQuery(preparedDelete, {
//                                 '$token': typedUtf8(hashedToken),
//                             });
//                             return null
//                         }
//                         await withRetries(del);
//                         return null;
//                     }
//                     return vr.toNative();
//                 });
//             } catch (error) {
//                 logger.error({error}, 'GET_VERIFICATION_REQUEST_ERROR')
//                 return Promise.reject(new BaseError('GET_VERIFICATION_REQUEST_ERROR', error))
//             }
//         }
//
//         async function deleteVerificationRequest(
//             identifier,
//             token,
//             secret,
//             provider
//         ) {
//             logger.debug({identifier}, 'DELETE_VERIFICATION_REQUEST')
//             try {
//                 const hashedToken = getHashedToken(token, secret);
//
//                 return await driver.tableClient.withSession(async (session) => {
//                     // Delete verification entry so it cannot be used again
//                     const preparedDelete = await session.prepareQuery(deleteVerificationRequestQuery);
//
//                     const del = async () => {
//                         await session.executeQuery(preparedDelete, {
//                             '$token': typedUtf8(hashedToken),
//                         });
//                         return null
//                     }
//                     await withRetries(del);
//                     return null;
//                 });
//             } catch (error) {
//                 logger.error({error}, 'DELETE_VERIFICATION_REQUEST_ERROR')
//                 return Promise.reject(new BaseError('DELETE_VERIFICATION_REQUEST_ERROR', error))
//             }
//         }
//
//         return Promise.resolve({
//             createUser,
//             getUser,
//             getUserByEmail,
//             getUserByProviderAccountId,
//             getUserByCredentials,
//             updateUser,
//             deleteUser,
//             linkAccount,
//             unlinkAccount,
//             createSession,
//             getSession,
//             updateSession,
//             deleteSession,
//             createVerificationRequest,
//             getVerificationRequest,
//             deleteVerificationRequest
//         })
//     }
//
//     return {
//         getAdapter
//     }
// }
