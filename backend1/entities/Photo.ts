import { Entity, OneToOne } from "typeorm"
import { PhotoMetadata } from "./PhotoMetadata"

@Entity()
export class Photo {
    /* ... other columns */

    @OneToOne(() => PhotoMetadata)
    metadata: PhotoMetadata | undefined
}