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

export enum TypeOfRegistration {
  E_RESIDENCY = 'E_RESIDENCY',
  RESIDENCY = 'RESIDENCY',
  LIMITED_E_RESIDENCY = 'LIMITED_E_RESIDENCY',
}

export enum TypeOfRegistrationSub {
  HONDURAN = 'HONDURAN',
  INTERNATIONAL = 'INTERNATIONAL',
}

export enum ResidentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity({ name: 'residents' })
@Unique(['sub'])
@Unique(['permitNumber'])
@Unique(['email'])
export class Resident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sub: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'permit_number', type: 'int' })
  permitNumber: number;

  @Column({ name: 'permit_number_qr_code', type: 'text', nullable: true })
  permitNumberQrCode?: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column({ name: 'country_of_birth' })
  countryOfBirth: string;

  @Column()
  email: string;

  @Column()
  citizenship: string;

  @Column()
  gender: string;

  // Address fields
  @Column({ name: 'address_country' })
  addressCountry: string;

  @Column({ name: 'address_city' })
  addressCity: string;

  @Column({ name: 'address_state', nullable: true })
  addressState?: string;

  @Column({ name: 'address_street_address' })
  addressStreetAddress: string;

  @Column({ name: 'address_zip_code' })
  addressZipCode: string;

  @Column({ name: 'address_is_verified', type: 'boolean', default: false })
  addressIsVerified: boolean;

  @Column({ name: 'phone_number' })
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

  @Column({ nullable: true })
  industry?: string;

  @Column({
    name: 'will_work_in_physical_jurisdiction',
    type: 'boolean',
    default: false,
  })
  willWorkInPhysicalJurisdiction: boolean;

  @Column({ name: 'regulatory_election', nullable: true })
  regulatoryElection?: string;

  @Column({ name: 'regulatory_election_sub', nullable: true })
  regulatoryElectionSub?: string;

  @Column({ name: 'first_registration_date', type: 'date', nullable: true })
  firstRegistrationDate?: Date;

  @Column({
    name: 'next_subscription_payment_date',
    type: 'date',
  })
  nextSubscriptionPaymentDate: Date;

  @Column({ name: 'profile_picture', type: 'text', nullable: true })
  profilePicture?: string;

  @Column({
    type: 'enum',
    enum: ResidentStatus,
    default: ResidentStatus.ACTIVE,
  })
  status: ResidentStatus;

  @Column({ name: 'residency_end_date', type: 'date', nullable: true })
  residencyEndDate?: Date;

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
