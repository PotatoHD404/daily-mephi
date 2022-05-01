import {Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {RatesService} from "lib/api/rates/rates.service";
import {Controller} from "lib/injection/decorators/controller.decorator";
import "lib/api/rates/rates.entity";

@Controller("/rates")
class RatesController {
}