// backend/src/migrations/1709000001000-CreateOrganizersTable.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganizersTable1709000001000
  implements MigrationInterface
{
  name = 'CreateOrganizersTable1709000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "organizers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_organizers_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_organizers_email" UNIQUE ("email")
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_organizer_email"
      ON "organizers" ("email");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_organizer_email";`);
    await queryRunner.query(`DROP TABLE "organizers";`);
  }
}
