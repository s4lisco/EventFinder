// backend/src/migrations/1710000003000-CreateAdminsAndModeration.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminsAndModeration1710000003000
  implements MigrationInterface
{
  name = 'CreateAdminsAndModeration1710000003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Admins table
    await queryRunner.query(`
      CREATE TABLE "admins" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "role" varchar(50) NOT NULL DEFAULT 'admin',
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_admins_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_admins_email" UNIQUE ("email")
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_admin_email" ON "admins" ("email");
    `);

    // Event moderation fields
    await queryRunner.query(`
      ALTER TABLE "events"
      ADD COLUMN IF NOT EXISTS "status" varchar NOT NULL DEFAULT 'pending';
    `);

    await queryRunner.query(`
      ALTER TABLE "events"
      ADD COLUMN IF NOT EXISTS "adminComment" text;
    `);

    // Organizer activation flag (optional)
    await queryRunner.query(`
      ALTER TABLE "organizers"
      ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "organizers"
      DROP COLUMN IF EXISTS "isActive";
    `);

    await queryRunner.query(`
      ALTER TABLE "events"
      DROP COLUMN IF EXISTS "adminComment";
    `);

    // Depending on earlier schema, you might not want to drop status,
    // but for symmetry we do:
    await queryRunner.query(`
      ALTER TABLE "events"
      DROP COLUMN IF EXISTS "status";
    `);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_admin_email";`);
    await queryRunner.query(`DROP TABLE "admins";`);
  }
}
