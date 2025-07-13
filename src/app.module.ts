import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndustryChangeApplicationModule } from './industry-change-application/industry-change-application.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustryChangeApplication } from './industry-change-application/entities/industry-change-application.entity';
import { ResidentModule } from './resident/resident.module';
import { Resident } from './resident/entities/resident.entity';
import * as fs from 'fs';

const isProd = process.env.NODE_ENV === 'production';

const ssl = isProd
  ? {
      ca: fs.readFileSync(
        process.env.RDS_CA_BUNDLE_PATH || '/app/certs/rds-ca-bundle.pem',
      ).toString(),
      rejectUnauthorized: true,
    }
  : undefined;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT ?? 5432),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [IndustryChangeApplication, Resident],
      synchronize: false,
      ssl,
    }),
    IndustryChangeApplicationModule,
    ResidentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
