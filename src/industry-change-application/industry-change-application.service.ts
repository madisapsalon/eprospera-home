import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindManyOptions, FindOneOptions, FindOptions } from 'typeorm';
import { CreateIndustryChangeApplicationDto } from './dto/create-industry-change-application.dto';
import { IndustryChangeApplication } from './entities/industry-change-application.entity';
import { Resident } from '../resident/entities/resident.entity';
import { ApplicationStatus } from './enums/application-status.enum';
import { ObjectStatus } from './enums/object-status.enum';
import { IndustryChangeApplicationResponseDto } from './dto/industry-change-application-response.dto';
import { IndustryChangeApplicationMapper } from './mappers/industry-change-application.mapper';
import { FindIndustryChangeApplicationsDto } from './dto/find-industry-change-applications.dto';
import { TypeOfRegistration } from '../resident/enums/type-of-registration.enum';
import { ResidentStatus } from '../resident/enums/resident-status.enum';

@Injectable()
export class IndustryChangeApplicationService {
  constructor(
    @InjectRepository(IndustryChangeApplication)
    private readonly appRepo: Repository<IndustryChangeApplication>,
    @InjectRepository(Resident)
    private readonly residentRepo: Repository<Resident>,
  ) {}

  async create(createDto: CreateIndustryChangeApplicationDto): Promise<IndustryChangeApplicationResponseDto> {
    const resident = await this.residentRepo.findOne({
      where: {
        sub: createDto.residentSub,
        typeOfRegistration: In([TypeOfRegistration.E_RESIDENCY, TypeOfRegistration.RESIDENCY]),
        status: ResidentStatus.ACTIVE,
      },
    });

    if (!resident) {
      throw new NotFoundException('Resident not found or inactive');
    }

    const isSameInformation =
      resident.willWorkInPhysicalJurisdiction === createDto.willWorkInPhysicalJurisdiction &&
      (resident.industry ?? null) === (createDto.industry ?? null) &&
      (resident.regulatoryElection ?? null) === (createDto.regulatoryElection ?? null) &&
      (resident.regulatoryElectionSub ?? null) === (createDto.regulatoryElectionSub ?? null);

    if (isSameInformation) {
      throw new BadRequestException('Requested industry information matches current information.');
    }

    const status = createDto.willWorkInPhysicalJurisdiction
      ? ApplicationStatus.IN_REVIEW
      : ApplicationStatus.APPROVED;

    const now = new Date();

    const application = this.appRepo.create({
      residentSub: createDto.residentSub,
      currentWillWorkInPhysicalJurisdiction: resident.willWorkInPhysicalJurisdiction,
      currentIndustry: resident.industry,
      currentRegulatoryElection: resident.regulatoryElection,
      currentRegulatoryElectionSub: resident.regulatoryElectionSub,
      requestedWillWorkInPhysicalJurisdiction: createDto.willWorkInPhysicalJurisdiction,
      requestedIndustry: createDto.industry ?? null,
      requestedRegulatoryElection: createDto.regulatoryElection ?? null,
      requestedRegulatoryElectionSub: createDto.regulatoryElectionSub ?? null,
      status,
      submittedAt: now,
      decisionDecidedAt: status === ApplicationStatus.APPROVED ? now : undefined,
      decisionDecidedBy: status === ApplicationStatus.APPROVED ? 'Automatic' : undefined,
    });

    const savedApp = await this.appRepo.save(application);

    if (status === ApplicationStatus.APPROVED) {
      resident.willWorkInPhysicalJurisdiction = createDto.willWorkInPhysicalJurisdiction;
      resident.industry = createDto.industry ?? null;
      resident.regulatoryElection = createDto.regulatoryElection ?? null;
      resident.regulatoryElectionSub = createDto.regulatoryElectionSub ?? null;
      resident.updatedAt = new Date();
      await this.residentRepo.save(resident);
    }

    return IndustryChangeApplicationMapper.toDto(savedApp);
  }

  async findAll(findDto: FindIndustryChangeApplicationsDto): Promise<IndustryChangeApplicationResponseDto[]> {
    const { residentSub, statuses } = findDto;
    
    const whereCondition: Record<string, any> = {
      residentSub,
      objectStatus: ObjectStatus.CURRENT
    };
    
    if (statuses && statuses.length > 0) {
      whereCondition.status = In(statuses);
    }
    
    const queryOptions: FindManyOptions<IndustryChangeApplication> = {
      where: whereCondition
    };
    
    const applications = await this.appRepo.find(queryOptions);
    
    return IndustryChangeApplicationMapper.toDtoList(applications);
  }

  async findOne(id: number): Promise<IndustryChangeApplicationResponseDto | null> {
    const application = await this.appRepo.findOne({
      where: {
        id,
        objectStatus: ObjectStatus.CURRENT
      }
    });

    if (!application) {
      throw new NotFoundException('Industry change application not found');
    }

    return IndustryChangeApplicationMapper.toDto(application);
  }

  async remove(id: number): Promise<{ message: string }> {
    const application = await this.appRepo.findOne({
      where: {
        id,
        objectStatus: ObjectStatus.CURRENT
      }
    });

    if (!application) {
      throw new NotFoundException('Industry change application not found');
    }

    if (application.status !== ApplicationStatus.IN_REVIEW) {
      throw new BadRequestException('Only applications in review status can be deleted');
    }
    application.objectStatus = ObjectStatus.DELETED;
    await this.appRepo.save(application);

    return { message: 'Industry change application deleted successfully' };
  }
}
