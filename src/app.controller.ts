import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';

class ResponseObj {
  @ApiProperty()
  message: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Get hello',
  })
  @ApiOkResponse({
    type: ResponseObj,
  })
  @Get('/ni-hao')
  getHello(): ResponseObj {
    const message = this.appService.getHello();
    const a = new ResponseObj();
    a.message = message;
    return a;
  }
}
