import {Entity} from "../../../decorators/db/entity.decorator";
import {BaseEntity} from "../../../implementations/baseEntity";
import {Column} from "../../../decorators/db/column.decorators";
import {Types} from "ydb-sdk";

@Entity()
class TestTable extends BaseEntity {
    constructor(id: number) {
        super();
        this.id = id;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
}

@Entity()
export class Account extends BaseEntity {


    constructor(id: number, userId: number, type: string, provider: string, providerAccountId: string, refresh_token: string, access_token: string, expires_at: number, token_type: string, scope: string, id_token: string, session_state: string, oauth_token_secret: string, oauth_token: string) {
        super();
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.provider = provider;
        this.providerAccountId = providerAccountId;
        this.refresh_token = refresh_token;
        this.access_token = access_token;
        this.expires_at = expires_at;
        this.token_type = token_type;
        this.scope = scope;
        this.id_token = id_token;
        this.session_state = session_state;
        this.oauth_token_secret = oauth_token_secret;
        this.oauth_token = oauth_token;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
    @Column(Types.UINT64)
    private userId: number;
    @Column(Types.STRING)
    private type: string;
    @Column(Types.STRING)
    private provider: string;
    @Column(Types.STRING)
    private providerAccountId: string;
    @Column(Types.STRING)
    private refresh_token: string;
    @Column(Types.STRING)
    private access_token: string;
    @Column(Types.UINT64)
    private expires_at: number;
    @Column(Types.STRING)
    private token_type: string;
    @Column(Types.STRING)
    private scope: string;
    @Column(Types.STRING)
    private id_token: string;
    @Column(Types.STRING)
    private session_state: string;
    @Column(Types.STRING)
    private oauth_token_secret: string;
    @Column(Types.STRING)
    private oauth_token: string;

}