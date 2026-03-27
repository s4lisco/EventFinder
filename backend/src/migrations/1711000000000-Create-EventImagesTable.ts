import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventImagesTable1711000000000 implements MigrationInterface {
  name = 'CreateEventImagesTable1711000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`event_images\` (
        \`id\` varchar(36) NOT NULL,
        \`eventId\` varchar(36) NOT NULL,
        \`storageKey\` varchar(500) NOT NULL,
        \`url\` varchar(500) NOT NULL,
        \`position\` int NOT NULL DEFAULT 0,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Foreign key constraint
    await queryRunner.query(`
      ALTER TABLE \`event_images\`
      ADD CONSTRAINT \`FK_event_images_event\`
      FOREIGN KEY (\`eventId\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE;
    `);

    // Index on eventId for faster lookups
    await queryRunner.query(`
      CREATE INDEX \`IDX_event_images_event_id\` ON \`event_images\` (\`eventId\`);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`event_images\` DROP FOREIGN KEY \`FK_event_images_event\`;`);
    await queryRunner.query(`DROP INDEX \`IDX_event_images_event_id\` ON \`event_images\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`event_images\`;`);
  }
}
