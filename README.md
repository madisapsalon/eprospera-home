# EProspera Home

EProspera Home is a NestJS application that provides a REST API for managing industry change applications and residents.

## Setting up development environment

```bash
docker compose up
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## API Documentation

### Health check

GET [/health](http://localhost:3000/health)

### Add industry change application

POST [/industry-change-applications](/industry-change-applications)

Request body:
```json
{
  "residentSub": "sub-001",
  "willWorkInPhysicalJurisdiction": true,
  "industry": "HEALTHCARE",
  "regulatoryElection": "OPTION_B",
  "regulatoryElectionSub": "sub-regulatory-option"
}
```

### Get industry change applications

GET [/industry-change-applications](/industry-change-applications)

### Get industry change application by id

GET [/industry-change-applications/:id](/industry-change-applications/:id)


## Database

Local development database is available at [http://localhost:5432](http://localhost:5432).

- DATABASE_HOST=postgres
- DATABASE_PORT=5432
- DATABASE_USER=postgres
- DATABASE_PASSWORD=postgres
- DATABASE_NAME=eprospera

## Deployment

The application is deployed on AWS using GitHub Actions.

The deployed application is available at [http://eprospera-home.madis.click/health](http://eprospera-home.madis.click/health)

