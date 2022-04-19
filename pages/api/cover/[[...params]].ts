import getSvg from "../../../components/getSvg";
import {createHandler, Get, Param, SetHeader} from '@storyofams/next-api-decorators';
import sharp from 'sharp';
import path from "path";

path.resolve(process.cwd(), 'fonts', 'fonts.conf')
path.resolve(process.cwd(), 'fonts', 'Montserrat-Medium.ttf')


class CoverHandler {
    @Get("/tutors/:id")
    @SetHeader('Content-Type', 'image/png')
    public async tutors(@Param('id') id: string) {
        const svg = getSvg('Test', 'Test2');
        const roundedCorners = Buffer.from(svg);

        const roundedCornerResizer = sharp(roundedCorners).png();
        // let doc = new DOMParser().parseFromString(svg, "text/xml");
        return await roundedCornerResizer.toBuffer()
    }

    @Get("/quotes/:id")
    @SetHeader('Content-Type', 'image/png')
    public async quotes(@Param('id') id: string) {
        const svg = getSvg('Test', 'Test2');
        const roundedCorners = Buffer.from(svg);

        const roundedCornerResizer = sharp(roundedCorners).png();
        // let doc = new DOMParser().parseFromString(svg, "text/xml");
        return await roundedCornerResizer.toBuffer()
    }

    @Get("/users/:id")
    @SetHeader('Content-Type', 'image/png')
    public async users(@Param('id') id: string) {
        const svg = getSvg('Test', 'Test2');
        const roundedCorners = Buffer.from(svg);

        const roundedCornerResizer = sharp(roundedCorners).png();
        // let doc = new DOMParser().parseFromString(svg, "text/xml");
        return await roundedCornerResizer.toBuffer()
    }
}

export default createHandler(CoverHandler);