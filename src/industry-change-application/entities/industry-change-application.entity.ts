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
import { Industry } from '../enums/industry.enum';
import { RegulatoryElection } from '../enums/regulatory-election.enum';

@Entity({ name: 'industry_change_applications' })
export class IndustryChangeApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'resident_sub', type: 'varchar' })
  residentSub: string;

  @ManyToOne(() => Resident, (resident) => resident.industryChangeApplications)
  @JoinColumn({ name: 'resident_sub', referencedColumnName: 'sub' })
  resident: Resident;

  @Column({
    name: 'current_will_work_in_physical_jurisdiction',
    type: 'boolean',
  })
  currentWillWorkInPhysicalJurisdiction: boolean;

  @Column({ name: 'current_industry', type: 'enum', enum: Industry, nullable: true })
  currentIndustry?: string | null;

  @Column({ name: 'current_regulatory_election', type: 'enum', enum: RegulatoryElection, nullable: true })
  currentRegulatoryElection?: string | null;

  @Column({ name: 'current_regulatory_election_sub', type: 'varchar', nullable: true })
  currentRegulatoryElectionSub?: string | null;

  @Column({
    name: 'requested_will_work_in_physical_jurisdiction',
    type: 'boolean',
  })
  requestedWillWorkInPhysicalJurisdiction: boolean;

  @Column({ name: 'requested_industry', type: 'enum', enum: Industry, nullable: true })
  requestedIndustry?: string | null;

  @Column({ name: 'requested_regulatory_election', type: 'enum', enum: RegulatoryElection, nullable: true })
  requestedRegulatoryElection?: string | null;

  @Column({ name: 'requested_regulatory_election_sub', type: 'varchar', nullable: true })
  requestedRegulatoryElectionSub?: string | null;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.IN_REVIEW,
  })
  status: ApplicationStatus;

  @Column({ name: 'submitted_at', type: 'timestamp', nullable: true })
  submittedAt?: Date | null;

  @Column({ name: 'decision_decided_at', type: 'timestamp', nullable: true })
  decisionDecidedAt?: Date | null;

  @Column({ name: 'decision_decided_by', type: 'varchar', nullable: true })
  decisionDecidedBy?: string | null;

  @Column({ name: 'decision_rejection_reason', type: 'text', nullable: true })
  decisionRejectionReason?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy?: string | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy?: string | null;

  @Column({
    name: 'object_status',
    type: 'enum',
    enum: ObjectStatus,
    default: ObjectStatus.CURRENT,
  })
  objectStatus: ObjectStatus;
}

