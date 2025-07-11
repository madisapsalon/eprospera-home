import { Industry } from '../enums/industry.enum';
import { RegulatoryElection } from '../enums/regulatory-election.enum';
import { IndustryChangeApplicationResponseDto, IndustryInformationDto, ApplicationDecisionDto } from '../dto/industry-change-application-response.dto';
import { IndustryChangeApplication } from '../entities/industry-change-application.entity';

export class IndustryChangeApplicationMapper {
  public static toDto(entity: IndustryChangeApplication): IndustryChangeApplicationResponseDto {
    const dto = new IndustryChangeApplicationResponseDto();
    
    dto.id = entity.id.toString();
    dto.residentSub = entity.residentSub;
    dto.status = entity.status;
    dto.submittedAt = entity.submittedAt;
    dto.objectStatus = entity.objectStatus;
    
    dto.current = this.mapToIndustryInformationDto(
      entity.currentWillWorkInPhysicalJurisdiction,
      entity.currentIndustry as Industry,
      entity.currentRegulatoryElection as RegulatoryElection,
      entity.currentRegulatoryElectionSub
    );
    
    dto.requested = this.mapToIndustryInformationDto(
      entity.requestedWillWorkInPhysicalJurisdiction,
      entity.requestedIndustry as Industry,
      entity.requestedRegulatoryElection as RegulatoryElection,
      entity.requestedRegulatoryElectionSub
    );
    
    if (entity.decisionDecidedAt || entity.decisionRejectionReason) {
      dto.decision = this.mapToApplicationDecisionDto(
        entity.decisionDecidedAt,
        entity.decisionRejectionReason
      );
    } else {
      dto.decision = null;
    }
    
    return dto;
  }

  public static toDtoList(entities: IndustryChangeApplication[]): IndustryChangeApplicationResponseDto[] {
    return entities.map(entity => this.toDto(entity));
  }
  

  private static mapToIndustryInformationDto(
    willWorkInPhysicalJurisdiction: boolean,
    industry?: Industry | string | null,
    regulatoryElection?: RegulatoryElection | string | null,
    regulatoryElectionSub?: string | null
  ): IndustryInformationDto {
    const dto = new IndustryInformationDto();
    
    dto.willWorkInPhysicalJurisdiction = willWorkInPhysicalJurisdiction;
    dto.industry = industry as Industry | null;
    dto.regulatoryElection = regulatoryElection as RegulatoryElection | null;
    dto.regulatoryElectionSub = regulatoryElectionSub;
    
    return dto;
  }
  
  private static mapToApplicationDecisionDto(
    decidedAt?: Date | null,
    rejectionReason?: string | null
  ): ApplicationDecisionDto {
    const dto = new ApplicationDecisionDto();
    
    dto.decidedAt = decidedAt;
    dto.rejectionReason = rejectionReason;
    
    return dto;
  }
}
