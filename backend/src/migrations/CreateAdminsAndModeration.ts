// backend/src/migrations/1710000003000-CreateAdminsAndModeration.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminsAndModeration1710000003000
  implements MigrationInterface
{
  name = 'CreateAdminsAndModeration1710000003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Admins table
    await queryRunner.query(`
      CREATE TABLE \`admins\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`password_hash\` varchar(255) NOT NULL,
        \`role\` varchar(50) NOT NULL DEFAULT 'admin',
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_admins_email\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE INDEX \`IDX_admin_email\` ON \`admins\` (\`email\`);
    `);

    // Organizer activation flag (optional)
    await queryRunner.query(`
      ALTER TABLE \`organizers\`
      ADD COLUMN \`isActive\` tinyint(1) NOT NULL DEFAULT 1;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`organizers\`
      DROP COLUMN \`isActive\`;
    `);

    await queryRunner.query(`DROP INDEX \`IDX_admin_email\` ON \`admins\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`admins\`;`);
  }
}
