// backend/src/migrations/1714000000000-AddArchivedEventStatus.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddArchivedEventStatus1714000000000 implements MigrationInterface {
  name = 'AddArchivedEventStatus1714000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`events\`
      MODIFY COLUMN \`status\` enum('pending','approved','rejected','archived')
      NOT NULL DEFAULT 'pending';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Move archived events back to rejected before reverting enum
    await queryRunner.query(`
      UPDATE \`events\` SET \`status\` = 'rejected' WHERE \`status\` = 'archived';
    `);
    await queryRunner.query(`
      ALTER TABLE \`events\`
      MODIFY COLUMN \`status\` enum('pending','approved','rejected')
      NOT NULL DEFAULT 'pending';
    `);
  }
}
