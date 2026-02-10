import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventImagesTable1711000000000 implements MigrationInterface {
  name = 'CreateEventImagesTable1711000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "event_images" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "eventId" uuid NOT NULL,
        "storageKey" varchar(500) NOT NULL,
        "url" varchar(500) NOT NULL,
        "position" int NOT NULL DEFAULT 0,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_event_images_id" PRIMARY KEY ("id")
      );
    `);

    // Foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "event_images"
      ADD CONSTRAINT "FK_event_images_event"
      FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE;
    `);

    // Index on eventId for faster lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_event_images_event_id" ON "event_images" ("eventId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event_images" DROP CONSTRAINT IF EXISTS "FK_event_images_event";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_event_images_event_id";`);
    await queryRunner.query(`DROP TABLE "event_images";`);
  }
}
