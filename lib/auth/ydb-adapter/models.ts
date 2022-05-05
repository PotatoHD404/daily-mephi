// import {declareType, TypedData, Ydb} from 'ydb-sdk';
//
// const Type = Ydb.Type;
// import {v4 as uuid4} from 'uuid';
// import {DateTime} from 'luxon';
// import Long from "long";
//
// type Timestamp = number | Long.Long | Date;
//
// interface IAccount {
//     compoundId: string;
//     userId: string;
//     providerType: string;
//     providerId: string;
//     providerAccountId: string;
//     refreshToken: string;
//     accessToken: string;
//     accessTokenExpires: Timestamp | null;
//     createdAt: Timestamp;
//     updatedAt: Timestamp;
// }
//
// export interface Account {
//     compoundId: string;
//     userId: string;
//     providerType: string;
//     providerId: string;
//     providerAccountId: string;
//     refreshToken?: string;
//     accessToken: string;
//     accessTokenExpires?: Date;
//     createdAt: Date;
//     updatedAt: Date;
// }
//
//
// export class AccountData extends TypedData {
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     public compoundId: string;
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     public userId: string;
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     public providerType: string;
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     public providerId: string;
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     public providerAccountId: string;
//     @declareType({optionalType: {item: {typeId: Type.PrimitiveTypeId.UTF8}}})
//     public refreshToken: string | null | undefined;
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     public accessToken: string;
//     @declareType({optionalType: {item: {typeId: Type.PrimitiveTypeId.UINT64}}})
//     public accessTokenExpires: Long.Long | null;
//     @declareType({typeId: Type.PrimitiveTypeId.UINT64})
//     public createdAt: Long.Long;
//     @declareType({typeId: Type.PrimitiveTypeId.UINT64})
//     public updatedAt: Long.Long;
//
//     constructor(data: IAccount) {
//         super(data);
//         this.compoundId = data.compoundId;
//         this.userId = data.userId;
//         this.providerType = data.providerType;
//         this.providerId = data.providerId;
//         this.providerAccountId = data.providerAccountId;
//         this.refreshToken = data.refreshToken;
//         this.accessToken = data.accessToken;
//         this.accessTokenExpires = longTimestamp(data.accessTokenExpires);
//         this.createdAt = longTimestamp(data.createdAt);
//         this.updatedAt = longTimestamp(data.updatedAt);
//     }
//
//     toNative() {
//         return {
//             compoundId: this.compoundId,
//             userId: this.userId,
//             providerType: this.providerType,
//             providerId: this.providerId,
//             providerAccountId: this.providerAccountId,
//             refreshToken: this.refreshToken,
//             accessToken: this.accessToken,
//             accessTokenExpires: this.accessTokenExpires ? new Date(this.accessTokenExpires.toNumber()) : null,
//             createdAt: new Date(this.createdAt.toNumber()),
//             updatedAt: new Date(this.updatedAt.toNumber()),
//         }
//     }
// }
//
// interface ISession {
//     sessionToken: string;
//     userId: string;
//     expires: Timestamp;
//     accessToken: string;
//     createdAt: Timestamp;
//     updatedAt: Timestamp;
// }
//
// export interface Session {
//     sessionToken: string;
//     userId: string;
//     expires: Date;
//     accessToken: string;
//     createdAt: Date;
//     updatedAt: Date;
// }
//
//
// function longTimestamp(value?: Date | number | Long.Long | null): Long.Long | null {
//     if (value === null || value === undefined) {
//         return null;
//     }
//     if (value instanceof Date) {
//         value = value.getTime();
//     }
//     return typeof value == "number" ? Long.fromNumber(value) : value;
// }
//
// export class SessionData extends TypedData {
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     public sessionToken: string;
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     public userId: string;
//     @declareType({typeId: Type.PrimitiveTypeId.UINT64})
//     public expires: Long.Long;
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     public accessToken: string;
//     @declareType({typeId: Type.PrimitiveTypeId.UINT64})
//     public createdAt: Long.Long;
//     @declareType({typeId: Type.PrimitiveTypeId.UINT64})
//     public updatedAt: Long.Long;
//
//     constructor(data: ISession) {
//         super(data);
//         this.sessionToken = data.sessionToken;
//         this.userId = data.userId;
//         this.expires = longTimestamp(data.expires);
//         this.accessToken = data.accessToken;
//         this.createdAt = longTimestamp(data.createdAt);
//         this.updatedAt = longTimestamp(data.updatedAt);
//     }
//
//     toNative(): Session {
//         return {
//             sessionToken: this.sessionToken,
//             userId: this.userId,
//             expires: new Date(this.expires.toNumber()),
//             accessToken: this.accessToken,
//             createdAt: new Date(this.createdAt.toNumber()),
//             updatedAt: new Date(this.updatedAt.toNumber()),
//         }
//     }
// }
//
// interface IUser {
//     id: string;
//     name: string;
//     email: string;
//     emailVerified?: Timestamp;
//     image: string;
//     createdAt: Timestamp;
//     updatedAt: Timestamp;
// }
//
// export interface User {
//     id: string;
//     name: string;
//     email: string;
//     emailVerified?: Date;
//     image: string;
//     createdAt: Date;
//     updatedAt: Date;
// }
//
//
// export class UserData extends TypedData {
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     public id: string;
//     @declareType({optionalType: {item: {typeId: Type.PrimitiveTypeId.UTF8}}})
//     public name: string | null;
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     public email: string;
//     @declareType({optionalType: {item: {typeId: Type.PrimitiveTypeId.UINT64}}})
//     public emailVerified: Long.Long | null;
//     @declareType({optionalType: {item: {typeId: Type.PrimitiveTypeId.UTF8}}})
//     public image: string | null;
//     @declareType({typeId: Type.PrimitiveTypeId.UINT64})
//     public createdAt: Long.Long;
//     @declareType({typeId: Type.PrimitiveTypeId.UINT64})
//     public updatedAt: Long.Long;
//
//     static create(
//         {
//             name, email, image, emailVerified,
//             createdAt = DateTime.local().toMillis(),
//             updatedAt = DateTime.local().toMillis(),
//             id = uuid4()
//         }) {
//         return new UserData({
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
//         this.emailVerified = data.emailVerified ? longTimestamp(data.emailVerified) : null;
//         this.image = data.image;
//         this.createdAt = longTimestamp(data.createdAt);
//         this.updatedAt = longTimestamp(data.updatedAt);
//     }
//
//     toNative(): User {
//         return {
//             id: this.id,
//             name: this.name,
//             email: this.email,
//             emailVerified: this.emailVerified ? new Date(this.emailVerified.toNumber()) : null,
//             image: this.image,
//             createdAt: new Date(this.createdAt.toNumber()),
//             updatedAt: new Date(this.updatedAt.toNumber()),
//         }
//     }
// }
//
// interface IVerificationRequests {
//     token: string;
//     identifier: string;
//     expires: Timestamp;
//     createdAt: Timestamp;
//     updatedAt: Timestamp;
// }
//
// interface VerificationRequests {
//     token: string;
//     identifier: string;
//     expires: Date;
//     createdAt: Date;
//     updatedAt: Date;
// }
//
//
// export class VerificationRequestData extends TypedData {
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     token: string;
//     @declareType({typeId: Type.PrimitiveTypeId.UTF8})
//     identifier: string;
//     @declareType({typeId: Type.PrimitiveTypeId.UINT64})
//     expires: Long.Long;
//     @declareType({typeId: Type.PrimitiveTypeId.UINT64})
//     createdAt: Long.Long;
//     @declareType({typeId: Type.PrimitiveTypeId.UINT64})
//     updatedAt: Long.Long;
//
//     constructor(data: IVerificationRequests) {
//         super(data);
//         this.token = data.token;
//         this.identifier = data.identifier;
//         this.expires = longTimestamp(data.expires);
//         this.createdAt = longTimestamp(data.createdAt);
//         this.updatedAt = longTimestamp(data.updatedAt);
//     }
//
//     toNative(): VerificationRequests {
//         return {
//             token: this.token,
//             identifier: this.identifier,
//             expires: new Date(this.expires.toNumber()),
//             createdAt: new Date(this.createdAt.toNumber()),
//             updatedAt: new Date(this.updatedAt.toNumber()),
//         }
//     }
// }
