import {
    Entity,
    OneToOne,
} from "typeorm"
import { Photo } from "./Photo"

@Entity()
export class PhotoMetadata {
    /* ... other columns */

    @OneToOne(() => Photo)
    photo: Photo | undefined

}