import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventsTable1710000000000 implements MigrationInterface {
  name = 'CreateEventsTable1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "events" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" varchar(255) NOT NULL,
        "description" text NOT NULL,
        "startDate" timestamptz NOT NULL,
        "endDate" timestamptz NULL,
        "category" varchar(100) NOT NULL,
        "priceInfo" text NULL,
        "locationName" varchar(255) NOT NULL,
        "address" varchar(500) NOT NULL,
        "latitude" double precision NOT NULL,
        "longitude" double precision NOT NULL,
        "location" geography(Point,4326) NULL,
        "organizerName" varchar(255) NOT NULL,
        "website" text NULL,
        "images" text[] NULL,
        "status" varchar NOT NULL DEFAULT 'pending',
        "adminComment" text NULL,
        "organizerId" uuid NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_events_id" PRIMARY KEY ("id")
      );
    `);

    // Optional: add foreign key constraint (organizer)
    await queryRunner.query(`
      ALTER TABLE "events"
      ADD CONSTRAINT "FK_events_organizer"
      FOREIGN KEY ("organizerId") REFERENCES "organizers"("id") ON DELETE SET NULL;
    `);

    // Indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_event_category" ON "events" ("category");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_event_start_date" ON "events" ("startDate");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_event_status" ON "events" ("status");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_event_location_spatial"
      ON "events"
      USING GIST ("location");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT IF EXISTS "FK_events_organizer";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_event_location_spatial";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_event_status";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_event_start_date";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_event_category";`);
    await queryRunner.query(`DROP TABLE "events";`);
  }
}
