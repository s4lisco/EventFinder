// backend/src/migrations/1715000000000-AddRoleToOrganizers.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleToOrganizers1715000000000 implements MigrationInterface {
  name = 'AddRoleToOrganizers1715000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`organizers\`
      ADD COLUMN \`role\` varchar(50) NOT NULL DEFAULT 'organizer';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`organizers\`
      DROP COLUMN \`role\`;
    `);
  }
}
