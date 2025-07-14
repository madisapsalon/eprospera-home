'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function (db) {
  await db.runSql("CREATE TYPE type_of_registration_enum AS ENUM ('E_RESIDENCY','RESIDENCY','LIMITED_E_RESIDENCY')");
  await db.runSql("CREATE TYPE type_of_registration_sub_enum AS ENUM ('HONDURAN','INTERNATIONAL')");
  await db.runSql("CREATE TYPE resident_status_enum AS ENUM ('ACTIVE','INACTIVE')");
  await db.runSql("CREATE TYPE regulatory_election_enum AS ENUM ('REG_ELECT_1','REG_ELECT_2','REG_ELECT_3')");
  
  return db.runSql(`
    CREATE TABLE IF NOT EXISTS residents (
      id SERIAL PRIMARY KEY,
      sub VARCHAR(255) NOT NULL UNIQUE,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      permit_number INTEGER NOT NULL UNIQUE,
      permit_number_qr_code TEXT,
      date_of_birth DATE NOT NULL,
      country_of_birth VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      citizenship VARCHAR(255) NOT NULL,
      gender VARCHAR(255) NOT NULL,
      address_country VARCHAR(255) NOT NULL,
      address_city VARCHAR(255) NOT NULL,
      address_state VARCHAR(255),
      address_street_address VARCHAR(255) NOT NULL,
      address_zip_code VARCHAR(255) NOT NULL,
      address_is_verified BOOLEAN NOT NULL DEFAULT FALSE,
      phone_number VARCHAR(255) NOT NULL,
      type_of_registration type_of_registration_enum NOT NULL,
      type_of_registration_sub type_of_registration_sub_enum,
      industry VARCHAR(255),
      will_work_in_physical_jurisdiction BOOLEAN NOT NULL DEFAULT FALSE,
      regulatory_election regulatory_election_enum,
      regulatory_election_sub VARCHAR(255),
      first_registration_date DATE,
      next_subscription_payment_date DATE NOT NULL,
      profile_picture TEXT,
      status resident_status_enum NOT NULL DEFAULT 'ACTIVE',
      residency_end_date DATE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

exports.down = async function (db) {
  await db.runSql('DROP TABLE IF EXISTS residents;');
  
  await db.runSql('DROP TYPE IF EXISTS resident_status_enum;');
  await db.runSql('DROP TYPE IF EXISTS type_of_registration_sub_enum;');
  await db.runSql('DROP TYPE IF EXISTS type_of_registration_enum;');
  await db.runSql('DROP TYPE IF EXISTS regulatory_election_enum;');
  
  return null;
};

exports._meta = {
  "version": 1
};
