import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndustryChangeApplicationModule } from './industry-change-application/industry-change-application.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustryChangeApplication } from './industry-change-application/entities/industry-change-application.entity';
import { ResidentModule } from './resident/resident.module';
import { Resident } from './resident/entities/resident.entity';
import * as fs from 'fs';

// SSL configuration for production environment
const sslConfig = process.env.NODE_ENV === 'production' ? {
  // Only disable certificate validation if explicitly set to false
  rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false',
  ca: process.env.NODE_ENV === 'production' && fs.existsSync('/app/certs/eu-north-1-bundle.pem') ?
    fs.readFileSync('/app/certs/eu-north-1-bundle.pem').toString() : undefined,
  // Use proper hostname verification in production
  checkServerIdentity: (host, cert) => {
    // You can implement custom hostname verification logic here if needed
    // Return undefined to accept the certificate, or an Error to reject it
    return undefined;
  }
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
