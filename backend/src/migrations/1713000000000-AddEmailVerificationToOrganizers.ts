// backend/src/migrations/1713000000000-AddEmailVerificationToOrganizers.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerificationToOrganizers1713000000000
  implements MigrationInterface
{
  name = 'AddEmailVerificationToOrganizers1713000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`organizers\`
      ADD COLUMN \`email_verified\` tinyint(1) NOT NULL DEFAULT 0,
      ADD COLUMN \`email_verification_token\` varchar(255) NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`organizers\`
      DROP COLUMN \`email_verification_token\`,
      DROP COLUMN \`email_verified\`;
    `);
  }
}
