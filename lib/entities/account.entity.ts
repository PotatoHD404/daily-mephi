import {Entity} from "../decorators/db/entity.decorator";
import {BaseEntity} from "../implementations/baseEntity";
import {Column} from "../decorators/db/column.decorators";
import {Types} from "ydb-sdk";
import {OneToOne} from "../decorators/db/oneToOne.decorator";
import {User} from "../api/users/users.entity";

@Entity()
export class Account extends BaseEntity {

    @Column(Types.UINT64, {primary: true})
    public id: number;
    
    @OneToOne(User)
    public user: User;
    
    @Column(Types.STRING)
    public type: string;
    
    @Column(Types.STRING)
    public provider: string;
    
    @Column(Types.STRING)
    public providerAccountId: string;
    
    @Column(Types.STRING)
    public refresh_token: string;
    
    @Column(Types.STRING)
    public access_token: string;
    
    @Column(Types.UINT64)
    public expires_at: number;
    
    @Column(Types.STRING)
    public token_type: string;
    
    @Column(Types.STRING)
    public scope: string;
    
    @Column(Types.STRING)
    public id_token: string;
    
    @Column(Types.STRING)
    public session_state: string;
    
    @Column(Types.STRING)
    public oauth_token_secret: string;
    
    @Column(Types.STRING)
    public oauth_token: string;


    constructor(id: number, user: User, type: string, provider: string, providerAccountId: string, refresh_token: string, access_token: string, expires_at: number, token_type: string, scope: string, id_token: string, session_state: string, oauth_token_secret: string, oauth_token: string) {
        super();
        this.id = id;
        this.user = user;
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
}