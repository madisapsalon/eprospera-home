import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resident } from './entities/resident.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resident])],
})
export class ResidentModule {}
