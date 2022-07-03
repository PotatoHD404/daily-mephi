import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'backend1/guards/auth.guard'
// import {Photo} from 'backend1/myentities/Photo'

@Controller()
export class AppController {
  @Get('/hello')
  helloWorld() {
    // const tmp = new Photo();

    return 'Hello, world!'
  }

  @Get('/protected')
  @UseGuards(AuthGuard)
  protected() {
    return 'I am protected!'
  }
}
