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
  return db.runSql(`
    INSERT INTO residents (
      sub, first_name, last_name, full_name, permit_number, permit_number_qr_code,
      date_of_birth, country_of_birth, email, citizenship, gender,
      address_country, address_city, address_state, address_street_address, address_zip_code,
      address_is_verified, phone_number, type_of_registration, type_of_registration_sub,
      industry, will_work_in_physical_jurisdiction, regulatory_election, regulatory_election_sub,
      first_registration_date, next_subscription_payment_date, profile_picture, status, residency_end_date
    ) VALUES
      (
        'sub-001', 'Alice', 'Johnson', 'Alice Johnson', 1001, 'c2FtcGxlX3FycjE=',
        '1990-03-15', 'USA', 'alice@example.com', 'USA', 'FEMALE',
        'USA', 'New York', 'NY', '123 Main St', '10001',
        TRUE, '+1-212-555-0100', 'E_RESIDENCY', 'HONDURAN',
        'TECHNOLOGY', TRUE, 'REG_ELECT_1', 'SUB_ELECT_1',
        '2025-01-01', '2026-01-01', 'iVBORw0KGgoAAA...', 'ACTIVE', NULL
      ),
      (
        'sub-002', 'Bob', 'Smith', 'Bob Smith', 1002, 'c2FtcGxlX3FycjI=',
        '1985-07-22', 'Canada', 'bob@example.com', 'Canada', 'MALE',
        'Canada', 'Toronto', 'ON', '456 Queen St', 'M5V2B6',
        FALSE, '+1-416-555-0200', 'RESIDENCY', 'INTERNATIONAL',
        'FINANCE', FALSE, 'REG_ELECT_2', 'SUB_ELECT_2',
        '2024-06-15', '2025-06-15', 'iVBORw0KGgoBBB...', 'ACTIVE', NULL
      ),
      (
        'sub-003', 'Carol', 'Davis', 'Carol Davis', 1003, 'c2FtcGxlX3FycjM=',
        '1992-11-05', 'UK', 'carol@example.com', 'UK', 'FEMALE',
        'UK', 'London', NULL, '789 King Rd', 'SW1A1AA',
        TRUE, '+44-20-5555-0300', 'LIMITED_E_RESIDENCY', NULL,
        'HEALTHCARE', TRUE, NULL, NULL,
        '2023-12-10', '2024-12-10', NULL, 'ACTIVE', NULL
      );
  `);
};

exports.down = async function (db) {
  return db.runSql(`
    DELETE FROM residents WHERE sub IN ('sub-001','sub-002','sub-003');
  `);
};

exports._meta = {
  "version": 1
};
