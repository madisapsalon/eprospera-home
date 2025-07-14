import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { IndustryChangeApplication } from '../../industry-change-application/entities/industry-change-application.entity';
import { RegulatoryElection } from '../../industry-change-application/enums/regulatory-election.enum';
import { TypeOfRegistration } from '../enums/type-of-registration.enum';
import { TypeOfRegistrationSub } from '../enums/type-of-registration-sub.enum';
import { ResidentStatus } from '../enums/resident-status.enum';

@Entity({ name: 'residents' })
@Unique(['sub'])
@Unique(['permitNumber'])
@Unique(['email'])
export class Resident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  sub: string;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;

  @Column({ name: 'full_name', type: 'varchar' })
  fullName: string;

  @Column({ name: 'permit_number', type: 'int' })
  permitNumber: number;

  @Column({ name: 'permit_number_qr_code', type: 'text', nullable: true })
  permitNumberQrCode?: string | null;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column({ name: 'country_of_birth', type: 'varchar' })
  countryOfBirth: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  citizenship: string;

  @Column({ type: 'varchar' })
  gender: string;

  @Column({ name: 'address_country', type: 'varchar' })
  addressCountry: string;

  @Column({ name: 'address_city', type: 'varchar' })
  addressCity: string;

  @Column({ name: 'address_state', type: 'varchar', nullable: true })
  addressState?: string | null;

  @Column({ name: 'address_street_address', type: 'varchar' })
  addressStreetAddress: string;

  @Column({ name: 'address_zip_code', type: 'varchar' })
  addressZipCode: string;

  @Column({ name: 'address_is_verified', type: 'boolean', default: false })
  addressIsVerified: boolean;

  @Column({ name: 'phone_number', type: 'varchar' })
  phoneNumber: string;

  @Column({
    name: 'type_of_registration',
    type: 'enum',
    enum: TypeOfRegistration,
  })
  typeOfRegistration: TypeOfRegistration;

  @Column({
    name: 'type_of_registration_sub',
    type: 'enum',
    enum: TypeOfRegistrationSub,
    nullable: true,
  })
  typeOfRegistrationSub?: TypeOfRegistrationSub;

  @Column({ type: 'varchar', nullable: true })
  industry?: string | null;

  @Column({
    name: 'will_work_in_physical_jurisdiction',
    type: 'boolean',
    default: false,
  })
  willWorkInPhysicalJurisdiction: boolean;

  @Column({
    name: 'regulatory_election',
    type: 'enum',
    enum: RegulatoryElection,
    nullable: true
  })
  regulatoryElection?: RegulatoryElection | null;

  @Column({ name: 'regulatory_election_sub', type: 'varchar', nullable: true })
  regulatoryElectionSub?: string | null;

  @Column({ name: 'first_registration_date', type: 'date', nullable: true })
  firstRegistrationDate?: Date | null;

  @Column({
    name: 'next_subscription_payment_date',
    type: 'date',
  })
  nextSubscriptionPaymentDate: Date;

  @Column({ name: 'profile_picture', type: 'text', nullable: true })
  profilePicture?: string | null;

  @Column({
    type: 'enum',
    enum: ResidentStatus,
    default: ResidentStatus.ACTIVE,
  })
  status: ResidentStatus;

  @Column({ name: 'residency_end_date', type: 'date', nullable: true })
  residencyEndDate?: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(
    () => IndustryChangeApplication,
    (industryChangeApplication) => industryChangeApplication.resident
  )
  industryChangeApplications: IndustryChangeApplication[];
}
