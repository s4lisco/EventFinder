// backend/src/migrations/1709000001000-CreateOrganizersTable.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganizersTable1709000001000
  implements MigrationInterface
{
  name = 'CreateOrganizersTable1709000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`organizers\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`password_hash\` varchar(255) NOT NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_organizers_email\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE INDEX \`IDX_organizer_email\`
      ON \`organizers\` (\`email\`);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_organizer_email\` ON \`organizers\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`organizers\`;`);
  }
}
