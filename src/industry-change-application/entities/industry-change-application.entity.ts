import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApplicationStatus } from '../enums/application-status.enum';
import { ObjectStatus } from '../enums/object-status.enum';
import { Resident } from '../../resident/entities/resident.entity';

@Entity({ name: 'industry_change_applications' })
export class IndustryChangeApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'resident_sub' })
  residentSub: string;

  @ManyToOne(() => Resident, (resident) => resident.industryChangeApplications)
  @JoinColumn({ name: 'resident_sub', referencedColumnName: 'sub' })
  resident: Resident;

  @Column({
    name: 'current_will_work_in_physical_jurisdiction',
    type: 'boolean',
  })
  currentWillWorkInPhysicalJurisdiction: boolean;

  @Column({ name: 'current_industry', nullable: true })
  currentIndustry?: string;

  @Column({ name: 'current_regulatory_election', nullable: true })
  currentRegulatoryElection?: string;

  @Column({ name: 'current_regulatory_election_sub', nullable: true })
  currentRegulatoryElectionSub?: string;

  @Column({
    name: 'requested_will_work_in_physical_jurisdiction',
    type: 'boolean',
  })
  requestedWillWorkInPhysicalJurisdiction: boolean;

  @Column({ name: 'requested_industry', nullable: true })
  requestedIndustry?: string;

  @Column({ name: 'requested_regulatory_election', nullable: true })
  requestedRegulatoryElection?: string;

  @Column({ name: 'requested_regulatory_election_sub', nullable: true })
  requestedRegulatoryElectionSub?: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.IN_REVIEW,
  })
  status: ApplicationStatus;

  @Column({ name: 'submitted_at', type: 'timestamp', nullable: true })
  submittedAt?: Date;

  @Column({ name: 'decision_decided_at', type: 'timestamp', nullable: true })
  decisionDecidedAt?: Date;

  @Column({ name: 'decision_decided_by', nullable: true })
  decisionDecidedBy?: string;

  @Column({ name: 'decision_rejection_reason', type: 'text', nullable: true })
  decisionRejectionReason?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy?: string;

  @Column({
    name: 'object_status',
    type: 'enum',
    enum: ObjectStatus,
    default: ObjectStatus.CURRENT,
  })
  objectStatus: ObjectStatus;
}

