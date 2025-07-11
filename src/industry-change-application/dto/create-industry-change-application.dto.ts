import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Industry } from '../enums/industry.enum';
import { RegulatoryElection } from '../enums/regulatory-election.enum';
import { ValidateIndustry, ValidateRegulatoryElection, ValidateRegulatoryElectionSub } from '../validators/validators';

export class CreateIndustryChangeApplicationDto {
  @IsNotEmpty()
  @IsString()
  residentSub: string;

  @IsNotEmpty()
  @IsBoolean()
  willWorkInPhysicalJurisdiction: boolean;

  @ValidateIndustry()
  industry: Industry | null;

  @ValidateRegulatoryElection()
  regulatoryElection: RegulatoryElection | null;

  @ValidateRegulatoryElectionSub()
  regulatoryElectionSub: string | null;
}
