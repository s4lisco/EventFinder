// backend/src/migrations/1716000000000-AddRejectionFieldsToEvents.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRejectionFieldsToEvents1716000000000
  implements MigrationInterface
{
  name = 'AddRejectionFieldsToEvents1716000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`events\`
      ADD COLUMN \`rejectionReason\` text NULL,
      ADD COLUMN \`rejectedAt\`     datetime NULL,
      ADD COLUMN \`approvedAt\`     datetime NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`events\`
      DROP COLUMN \`approvedAt\`,
      DROP COLUMN \`rejectedAt\`,
      DROP COLUMN \`rejectionReason\`;
    `);
  }
}
