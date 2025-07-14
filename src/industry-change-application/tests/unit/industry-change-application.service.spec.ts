import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { mockDeep } from 'jest-mock-extended';

import { IndustryChangeApplicationService } from '../../industry-change-application.service';
import { IndustryChangeApplication } from '../../entities/industry-change-application.entity';
import { Resident } from '../../../resident/entities/resident.entity';
import { CreateIndustryChangeApplicationDto } from '../../dto/create-industry-change-application.dto';
import { FindIndustryChangeApplicationsDto } from '../../dto/find-industry-change-applications.dto';
import { ApplicationStatus } from '../../enums/application-status.enum';
import { ObjectStatus } from '../../enums/object-status.enum';
import { IndustryChangeApplicationMapper } from '../../mappers/industry-change-application.mapper';
import { Industry } from '../../enums/industry.enum';
import { RegulatoryElection } from '../../enums/regulatory-election.enum';
import { createDeepPartial } from '../../../../test/utils/create-deep-partial.util';
import { TypeOfRegistration } from '../../../resident/enums/type-of-registration.enum';
import { ResidentStatus } from '../../../resident/enums/resident-status.enum';

describe('IndustryChangeApplicationService', () => {
  let service: IndustryChangeApplicationService;
  let appRepo = mockDeep<Repository<IndustryChangeApplication>>();
  let residentRepo = mockDeep<Repository<Resident>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndustryChangeApplicationService,
        {
          provide: getRepositoryToken(IndustryChangeApplication),
          useValue: appRepo,
        },
        {
          provide: getRepositoryToken(Resident),
          useValue: residentRepo,
        },
      ],
    }).compile();

    service = module.get<IndustryChangeApplicationService>(IndustryChangeApplicationService);

    jest.spyOn(IndustryChangeApplicationMapper, 'toDto').mockImplementation((app) => app as any);
    jest.spyOn(IndustryChangeApplicationMapper, 'toDtoList').mockImplementation((apps) => apps as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException when resident not found', async () => {
      const createDto: CreateIndustryChangeApplicationDto = {
        residentSub: 'test-sub',
        willWorkInPhysicalJurisdiction: true,
        industry: Industry.TECHNOLOGY,
        regulatoryElection: RegulatoryElection.OPTION_A,
        regulatoryElectionSub: 'SubOption1',
      };
      residentRepo.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
      expect(residentRepo.findOne).toHaveBeenCalledWith({
        where: {
          sub: createDto.residentSub,
          typeOfRegistration: In([TypeOfRegistration.E_RESIDENCY, TypeOfRegistration.RESIDENCY]),
          status: ResidentStatus.ACTIVE,
        },
      });
    });

    it('should throw BadRequestException when requested info matches current info', async () => {
      const createDto: CreateIndustryChangeApplicationDto = {
        residentSub: 'test-sub',
        willWorkInPhysicalJurisdiction: true,
        industry: Industry.TECHNOLOGY,
        regulatoryElection: RegulatoryElection.OPTION_A,
        regulatoryElectionSub: 'SubOption1',
      };
      const resident = createDeepPartial<Resident>({
        sub: 'test-sub',
        willWorkInPhysicalJurisdiction: true,
        industry: Industry.TECHNOLOGY,
        regulatoryElection: RegulatoryElection.OPTION_A,
        regulatoryElectionSub: 'SubOption1',
        status: ResidentStatus.ACTIVE,
        typeOfRegistration: TypeOfRegistration.E_RESIDENCY,
      });
      residentRepo.findOne.mockResolvedValue(resident);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      expect(residentRepo.findOne).toHaveBeenCalledWith({
        where: {
          sub: createDto.residentSub,
          typeOfRegistration: In([TypeOfRegistration.E_RESIDENCY, TypeOfRegistration.RESIDENCY]),
          status: ResidentStatus.ACTIVE,
        },
      });
    });

    it('should create application with IN_REVIEW status when willWorkInPhysicalJurisdiction is true', async () => {
      const createDto: CreateIndustryChangeApplicationDto = {
        residentSub: 'test-sub',
        willWorkInPhysicalJurisdiction: true,
        industry: Industry.TECHNOLOGY,
        regulatoryElection: RegulatoryElection.OPTION_A,
        regulatoryElectionSub: 'SubOption1',
      };
      const resident = createDeepPartial<Resident>({
        sub: 'test-sub',
        willWorkInPhysicalJurisdiction: false,
        industry: Industry.FINANCE,
        regulatoryElection: RegulatoryElection.OPTION_B,
        regulatoryElectionSub: 'SubOption2',
        status: ResidentStatus.ACTIVE,
        typeOfRegistration: TypeOfRegistration.E_RESIDENCY,
      });
      const createdApp = createDeepPartial<IndustryChangeApplication>({
        id: 1,
        status: ApplicationStatus.IN_REVIEW,
      });
      
      residentRepo.findOne.mockResolvedValue(resident);
      appRepo.create.mockReturnValue(createdApp);
      appRepo.save.mockResolvedValue(createdApp);


      const result = await service.create(createDto);


      expect(result).toEqual(createdApp);
      expect(appRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        residentSub: createDto.residentSub,
        status: ApplicationStatus.IN_REVIEW,
      }));
      expect(residentRepo.save).not.toHaveBeenCalled();
    });

    it('should create application with APPROVED status and update resident when willWorkInPhysicalJurisdiction is false', async () => {
      const createDto: CreateIndustryChangeApplicationDto = {
        residentSub: 'test-sub',
        willWorkInPhysicalJurisdiction: false,
        industry: Industry.TECHNOLOGY,
        regulatoryElection: RegulatoryElection.OPTION_A,
        regulatoryElectionSub: 'SubOption1',
      };
      const resident = createDeepPartial<Resident>({
        sub: 'test-sub',
        willWorkInPhysicalJurisdiction: true,
        industry: Industry.FINANCE,
        regulatoryElection: RegulatoryElection.OPTION_B,
        regulatoryElectionSub: 'SubOption2',
        status: ResidentStatus.ACTIVE,
        typeOfRegistration: TypeOfRegistration.E_RESIDENCY,
        updatedAt: new Date('2023-01-01'),
      });
      const createdApp = createDeepPartial<IndustryChangeApplication>({
        id: 1,
        status: ApplicationStatus.APPROVED,
      });
      
      residentRepo.findOne.mockResolvedValue(resident);
      appRepo.create.mockReturnValue(createdApp);
      appRepo.save.mockResolvedValue(createdApp);
      residentRepo.save.mockResolvedValue({
        ...resident,
        willWorkInPhysicalJurisdiction: createDto.willWorkInPhysicalJurisdiction,
        industry: createDto.industry ?? undefined,
        regulatoryElection: createDto.regulatoryElection ?? undefined,
        regulatoryElectionSub: createDto.regulatoryElectionSub ?? undefined,
        updatedAt: expect.any(Date),
      });

      const result = await service.create(createDto);

      expect(result).toEqual(createdApp);
      expect(appRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        residentSub: createDto.residentSub,
        status: ApplicationStatus.APPROVED,
        submittedAt: expect.any(Date),
        decisionDecidedAt: expect.any(Date),
        decisionDecidedBy: 'Automatic',
      }));

      expect(residentRepo.save).toHaveBeenCalledWith(expect.objectContaining({
        willWorkInPhysicalJurisdiction: createDto.willWorkInPhysicalJurisdiction,
        industry: createDto.industry,
        regulatoryElection: createDto.regulatoryElection,
        regulatoryElectionSub: createDto.regulatoryElectionSub,
        updatedAt: expect.any(Date),
      }));
    });
    
    it('should handle null values in industry and regulatory fields correctly', async () => {
      const createDto: CreateIndustryChangeApplicationDto = {
        residentSub: 'test-sub',
        willWorkInPhysicalJurisdiction: false,
        industry: null,
        regulatoryElection: null,
        regulatoryElectionSub: null,
      };
      
      const resident = createDeepPartial<Resident>({
        sub: 'test-sub',
        willWorkInPhysicalJurisdiction: true,
        industry: Industry.FINANCE,
        regulatoryElection: RegulatoryElection.OPTION_B,
        regulatoryElectionSub: 'SubOption2',
        status: ResidentStatus.ACTIVE,
        typeOfRegistration: TypeOfRegistration.E_RESIDENCY,
      });
      
      const savedApp = createDeepPartial<IndustryChangeApplication>({
        id: 1,
        residentSub: 'test-sub',
        currentWillWorkInPhysicalJurisdiction: true,
        currentIndustry: Industry.FINANCE,
        currentRegulatoryElection: RegulatoryElection.OPTION_B,
        currentRegulatoryElectionSub: 'SubOption2',
        requestedWillWorkInPhysicalJurisdiction: false,
        requestedIndustry: null,
        requestedRegulatoryElection: null,
        requestedRegulatoryElectionSub: null,
        status: ApplicationStatus.APPROVED,
        submittedAt: expect.any(Date),
        decisionDecidedAt: expect.any(Date),
        decisionDecidedBy: 'Automatic',
      });
      
      residentRepo.findOne.mockResolvedValue(resident);
      appRepo.create.mockReturnValue(savedApp);
      appRepo.save.mockResolvedValue(savedApp);
      
      const result = await service.create(createDto);
      
      expect(result).toEqual(savedApp);
      expect(appRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        requestedIndustry: null,
        requestedRegulatoryElection: null,
        requestedRegulatoryElectionSub: null,
      }));
    });
  });
  
  describe('findAll', () => {
    it('should return all applications for a resident', async () => {
      const findDto: FindIndustryChangeApplicationsDto = {
        residentSub: 'test-sub',
      };
      const applications = createDeepPartial<IndustryChangeApplication[]>([
        { id: 1, residentSub: 'test-sub', status: ApplicationStatus.APPROVED },
        { id: 2, residentSub: 'test-sub', status: ApplicationStatus.IN_REVIEW },
      ]);
      appRepo.find.mockResolvedValue(applications);

      const result = await service.findAll(findDto);

      expect(result).toEqual(applications);
      expect(appRepo.find).toHaveBeenCalledWith({
        where: {
          residentSub: findDto.residentSub,
          objectStatus: ObjectStatus.CURRENT,
        },
      });
    });

    it('should filter applications by status when provided', async () => {
      const findDto: FindIndustryChangeApplicationsDto = {
        residentSub: 'test-sub',
        statuses: [ApplicationStatus.IN_REVIEW],
      };
      const applications = createDeepPartial<IndustryChangeApplication[]>([
        { id: 2, residentSub: 'test-sub', status: ApplicationStatus.IN_REVIEW },
      ]);
      appRepo.find.mockResolvedValue(applications);

      const result = await service.findAll(findDto);

      expect(result).toEqual(applications);
      expect(appRepo.find).toHaveBeenCalledWith({
        where: {
          residentSub: findDto.residentSub,
          objectStatus: ObjectStatus.CURRENT,
          status: In([ApplicationStatus.IN_REVIEW]),
        },
      });
    });
    
    it('should filter applications by multiple statuses when provided', async () => {
      const findDto: FindIndustryChangeApplicationsDto = {
        residentSub: 'test-sub',
        statuses: [ApplicationStatus.IN_REVIEW, ApplicationStatus.APPROVED],
      };
      const applications = createDeepPartial<IndustryChangeApplication[]>([
        { id: 1, residentSub: 'test-sub', status: ApplicationStatus.APPROVED },
        { id: 2, residentSub: 'test-sub', status: ApplicationStatus.IN_REVIEW },
      ]);
      appRepo.find.mockResolvedValue(applications);

      const result = await service.findAll(findDto);

      expect(result).toEqual(applications);
      expect(appRepo.find).toHaveBeenCalledWith({
        where: {
          residentSub: findDto.residentSub,
          objectStatus: ObjectStatus.CURRENT,
          status: In([ApplicationStatus.IN_REVIEW, ApplicationStatus.APPROVED]),
        },
      });
    });
    
    it('should return empty array when no applications found', async () => {
      const findDto: FindIndustryChangeApplicationsDto = {
        residentSub: 'test-sub',
      };
      appRepo.find.mockResolvedValue([]);

      const result = await service.findAll(findDto);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an application when found', async () => {
      const id = 1;
      const application = createDeepPartial<IndustryChangeApplication>({ id, residentSub: 'test-sub', status: ApplicationStatus.APPROVED });
      appRepo.findOne.mockResolvedValue(application);

      const result = await service.findOne(id);

      expect(result).toEqual(application);
      expect(appRepo.findOne).toHaveBeenCalledWith({
        where: {
          id,
          objectStatus: ObjectStatus.CURRENT,
        },
      });
    });

    it('should throw NotFoundException when application not found', async () => {
      const id = 999;
      appRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      expect(appRepo.findOne).toHaveBeenCalledWith({
        where: {
          id,
          objectStatus: ObjectStatus.CURRENT,
        },
      });
    });
  });

  describe('remove', () => {
    it('should mark application as deleted when valid', async () => {
      const id = 1;
      const application = createDeepPartial<IndustryChangeApplication>({ 
        id, 
        residentSub: 'test-sub', 
        status: ApplicationStatus.IN_REVIEW,
        objectStatus: ObjectStatus.CURRENT,
      });
      appRepo.findOne.mockResolvedValue(application);
      appRepo.save.mockResolvedValue({ ...application, objectStatus: ObjectStatus.DELETED });

      const result = await service.remove(id);

      expect(result).toEqual({ message: 'Industry change application deleted successfully' });
      expect(appRepo.findOne).toHaveBeenCalledWith({
        where: {
          id,
          objectStatus: ObjectStatus.CURRENT,
        },
      });
      expect(appRepo.save).toHaveBeenCalledWith(expect.objectContaining({
        objectStatus: ObjectStatus.DELETED,
      }));
    });

    it('should throw NotFoundException when application not found', async () => {
      const id = 999;
      appRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      expect(appRepo.findOne).toHaveBeenCalledWith({
        where: {
          id,
          objectStatus: ObjectStatus.CURRENT,
        },
      });
    });

    it('should throw BadRequestException when application is not in IN_REVIEW status', async () => {
      const id = 1;
      const application = createDeepPartial<IndustryChangeApplication>({ 
        id, 
        residentSub: 'test-sub', 
        status: ApplicationStatus.APPROVED,
        objectStatus: ObjectStatus.CURRENT,
      });
      
      // Reset mock calls before this test
      appRepo.save.mockReset();
      appRepo.findOne.mockResolvedValue(application);

      await expect(service.remove(id)).rejects.toThrow(BadRequestException);
      expect(appRepo.findOne).toHaveBeenCalledWith({
        where: {
          id,
          objectStatus: ObjectStatus.CURRENT,
        },
      });
      expect(appRepo.save).not.toHaveBeenCalled();
    });
    
    it('should throw BadRequestException when application is in REJECTED status', async () => {
      const id = 1;
      const application = createDeepPartial<IndustryChangeApplication>({ 
        id, 
        residentSub: 'test-sub', 
        status: ApplicationStatus.REJECTED,
        objectStatus: ObjectStatus.CURRENT,
      });
      appRepo.findOne.mockResolvedValue(application);

      await expect(service.remove(id)).rejects.toThrow(BadRequestException);
    });
  });
});
