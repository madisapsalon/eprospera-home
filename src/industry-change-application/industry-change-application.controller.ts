import { Controller, Get, Post, Body, Param, Delete, NotFoundException, BadRequestException, Query } from '@nestjs/common';
import { ObjectStatus } from './enums/object-status.enum';
import { IndustryChangeApplicationService } from './industry-change-application.service';
import { CreateIndustryChangeApplicationDto } from './dto/create-industry-change-application.dto';
import { FindIndustryChangeApplicationsDto } from './dto/find-industry-change-applications.dto';


@Controller('industry-change-application')
export class IndustryChangeApplicationController {
  constructor(private readonly industryChangeApplicationService: IndustryChangeApplicationService) {}

  @Post('/')
  create(@Body() createIndustryChangeApplicationDto: CreateIndustryChangeApplicationDto) {
    return this.industryChangeApplicationService.create(createIndustryChangeApplicationDto);
  }

  @Get()
  async findAll(@Query() findDto: FindIndustryChangeApplicationsDto) {
    return this.industryChangeApplicationService.findAll(findDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.industryChangeApplicationService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.industryChangeApplicationService.remove(+id);
  }
}
