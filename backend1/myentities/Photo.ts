import { Entity } from "lib/database/decorators/entity.decorator"
import { OneToOne } from "lib/database/decorators/oneToOne.decorator"
import { PhotoMetadata } from "./PhotoMetadata"

@Entity()
export class Photo {
    /* ... other columns */

    @OneToOne(() => PhotoMetadata)
    metadata: PhotoMetadata | undefined
}