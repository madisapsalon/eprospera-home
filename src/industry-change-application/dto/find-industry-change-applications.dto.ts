import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '../enums/application-status.enum';

export class FindIndustryChangeApplicationsDto {
  @IsString()
  @IsNotEmpty()
  residentSub: string;

  @IsOptional()
  @IsArray()
  @IsEnum(ApplicationStatus, { each: true })
  statuses?: ApplicationStatus[];
}
