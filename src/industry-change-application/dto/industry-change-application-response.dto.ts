import { Expose, Type } from 'class-transformer';
import { Industry } from '../enums/industry.enum';
import { RegulatoryElection } from '../enums/regulatory-election.enum';
import { ApplicationStatus } from '../enums/application-status.enum';
import { ObjectStatus } from '../enums/object-status.enum';

export class IndustryInformationDto {
  @Expose()
  willWorkInPhysicalJurisdiction: boolean;

  @Expose()
  industry?: Industry | null;

  @Expose()
  regulatoryElection?: RegulatoryElection | null;

  @Expose()
  regulatoryElectionSub?: string | null;
}

export class ApplicationDecisionDto {
  @Expose()
  decidedAt?: Date | null;

  @Expose()
  rejectionReason?: string | null;
}

export class IndustryChangeApplicationResponseDto {
  @Expose()
  id: string;

  @Expose()
  residentSub: string;

  @Type(() => IndustryInformationDto)
  @Expose()
  current: IndustryInformationDto;

  @Type(() => IndustryInformationDto)
  @Expose()
  requested: IndustryInformationDto;

  @Expose()
  status: ApplicationStatus;

  @Expose()
  submittedAt?: Date | null;

  @Type(() => ApplicationDecisionDto)
  @Expose()
  decision?: ApplicationDecisionDto | null;

  @Expose()
  objectStatus: ObjectStatus;
}
