import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndustryChangeApplicationModule } from './industry-change-application/industry-change-application.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustryChangeApplication } from './industry-change-application/entities/industry-change-application.entity';
import { ResidentModule } from './resident/resident.module';
import { Resident } from './resident/entities/resident.entity';
import * as fs from 'fs';

const sslConfig = process.env.NODE_ENV === 'production' ? {
  // Allow setting rejectUnauthorized via environment variable
  rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false',
  ca: process.env.NODE_ENV === 'production' ? 
    fs.readFileSync('/app/certs/eu-north-1-bundle.pem').toString() : 
    undefined,
  // Add these options to help with certificate verification
  checkServerIdentity: () => undefined // Skip hostname verification
} : false;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'eprospera',
      entities: [
        IndustryChangeApplication,
        Resident,
      ],
      migrations: undefined,
      synchronize: false,
      ssl: sslConfig,
    }),
    IndustryChangeApplicationModule,
    ResidentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
