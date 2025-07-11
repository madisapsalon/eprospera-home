import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustryChangeApplication } from './entities/industry-change-application.entity';
import { Resident } from '../resident/entities/resident.entity';
import { IndustryChangeApplicationService } from './industry-change-application.service';
import { IndustryChangeApplicationController } from './industry-change-application.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IndustryChangeApplication, Resident])],
  controllers: [IndustryChangeApplicationController],
  providers: [IndustryChangeApplicationService],
})
export class IndustryChangeApplicationModule {}
