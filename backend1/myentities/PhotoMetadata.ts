import { Entity } from "lib/database/decorators/entity.decorator"
import { OneToOne } from "lib/database/decorators/oneToOne.decorator"
import { Photo } from "./Photo"

@Entity()
export class PhotoMetadata {
    /* ... other columns */

    @OneToOne(() => Photo)
    photo: Photo | undefined

}