import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventsTable1710000000000 implements MigrationInterface {
  name = 'CreateEventsTable1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`events\` (
        \`id\` varchar(36) NOT NULL,
        \`title\` varchar(255) NOT NULL,
        \`description\` text NOT NULL,
        \`startDate\` datetime(6) NOT NULL,
        \`endDate\` datetime(6) NULL,
        \`category\` varchar(100) NOT NULL,
        \`priceInfo\` text NULL,
        \`locationName\` varchar(255) NOT NULL,
        \`address\` varchar(500) NOT NULL,
        \`latitude\` double NOT NULL,
        \`longitude\` double NOT NULL,
        \`organizerName\` varchar(255) NOT NULL,
        \`website\` text NULL,
        \`images\` json NULL,
        \`status\` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
        \`adminComment\` text NULL,
        \`organizerId\` varchar(36) NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Optional: add foreign key constraint (organizer)
    await queryRunner.query(`
      ALTER TABLE \`events\`
      ADD CONSTRAINT \`FK_events_organizer\`
      FOREIGN KEY (\`organizerId\`) REFERENCES \`organizers\`(\`id\`) ON DELETE SET NULL;
    `);

    // Indexes
    await queryRunner.query(`
      CREATE INDEX \`IDX_event_category\` ON \`events\` (\`category\`);
    `);

    await queryRunner.query(`
      CREATE INDEX \`IDX_event_start_date\` ON \`events\` (\`startDate\`);
    `);

    await queryRunner.query(`
      CREATE INDEX \`IDX_event_status\` ON \`events\` (\`status\`);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_events_organizer\`;`);
    await queryRunner.query(`DROP INDEX \`IDX_event_status\` ON \`events\`;`);
    await queryRunner.query(`DROP INDEX \`IDX_event_start_date\` ON \`events\`;`);
    await queryRunner.query(`DROP INDEX \`IDX_event_category\` ON \`events\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`events\`;`);
  }
}
