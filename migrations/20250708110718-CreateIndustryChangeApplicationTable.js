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
  await db.runSql("CREATE TYPE application_status_enum AS ENUM ('IN_REVIEW','APPROVED','REJECTED')");
  await db.runSql("CREATE TYPE object_status_enum AS ENUM ('CURRENT','DELETED')");

  return db.runSql(`
    CREATE TABLE IF NOT EXISTS industry_change_applications (
      id SERIAL PRIMARY KEY,
      resident_sub VARCHAR(255) NOT NULL REFERENCES residents(sub) ON DELETE CASCADE,

      current_will_work_in_physical_jurisdiction BOOLEAN NOT NULL,
      current_industry VARCHAR(255),
      current_regulatory_election regulatory_election_enum,
      current_regulatory_election_sub VARCHAR(255),
      requested_will_work_in_physical_jurisdiction BOOLEAN NOT NULL,
      requested_industry VARCHAR(255),
      requested_regulatory_election regulatory_election_enum,
      requested_regulatory_election_sub VARCHAR(255),

      status application_status_enum NOT NULL DEFAULT 'IN_REVIEW',
      submitted_at TIMESTAMP,

      decision_decided_at TIMESTAMP,
      decision_decided_by VARCHAR(255),
      decision_rejection_reason TEXT,

      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_by VARCHAR(255),
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_by VARCHAR(255),
      object_status object_status_enum NOT NULL DEFAULT 'CURRENT'
    );
  `);
};

exports.down = async function (db) {
  await db.runSql('DROP TABLE IF EXISTS industry_change_applications;');
  await db.runSql('DROP TYPE IF EXISTS object_status_enum;');
  await db.runSql('DROP TYPE IF EXISTS application_status_enum;');
  return null;
};

exports._meta = {
  "version": 1
};
