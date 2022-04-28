import {AlterTableDescription, AlterTableSettings, Session, Ydb} from "ydb-sdk";
import {retryable} from "ydb-sdk/build/retries";
import {ensureOperationSucceeded, pessimizable} from "ydb-sdk/build/utils";
import {MissingStatus} from "ydb-sdk/build/errors";

export class PatchedSession extends Session {
    constructor(session: Session) {
        super(session["api"], session["endpoint"], session["sessionId"], session["logger"]);
    }

    @retryable()
    @pessimizable
    public async alterTable(tablePath: string, description: AlterTableDescription, settings?: AlterTableSettings): Promise<void> {
        const {
            addColumns,
            dropColumns,
            alterColumns,
            setTtlSettings,
            dropTtlSettings,
            addIndexes,
            dropIndexes,
        } = description;
        const request: Ydb.Table.IAlterTableRequest = {
            sessionId: this.sessionId,
            path: `${this.endpoint.database}/${tablePath}`,
            addColumns,
            dropColumns,
            alterColumns,
            setTtlSettings,
            dropTtlSettings,
            addIndexes: addIndexes.map(el => {
                return {...el, globalIndex: {}};
            }),
            dropIndexes
        };
        if (settings) {
            request.operationParams = settings.operationParams;
        }
        try {
            ensureOperationSucceeded(await this["api"].alterTable(request));
        } catch (error: any) {
            if (!(error instanceof MissingStatus))
                throw error;
        }
    }
}