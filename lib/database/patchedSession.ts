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
    public async alterTable(tablePath: string, description: AlterTableDescription, settings?: AlterTableSettings, recursive: Boolean = false): Promise<void> {
        let {
            addColumns,
            dropColumns,
            alterColumns,
            setTtlSettings,
            dropTtlSettings,
            addIndexes,
            dropIndexes,
        } = description;
        if (dropIndexes.length > 0 && !recursive) {
            for (const index of dropIndexes) {
                const desc = new AlterTableDescription();
                desc.dropIndexes.push(index);
                await this.alterTable(tablePath, desc, settings, true);
            }
            dropIndexes = []
        }

        const request: Ydb.Table.IAlterTableRequest = {
            sessionId: this.sessionId,
            path: `${this.endpoint.database}/${tablePath}`,
            addColumns,
            dropColumns,
            alterColumns,
            setTtlSettings,
            dropTtlSettings,
            addIndexes: recursive ? addIndexes.map(el => {
                return {...el, globalIndex: {}};
            }) : undefined,
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
        if (!recursive && addIndexes.length > 0) {
            const desc = new AlterTableDescription();
            desc.addIndexes = addIndexes;
            await this.alterTable(tablePath, desc, settings, true);
            console.log("here")
        }
    }
}