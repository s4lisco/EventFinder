import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropEventLocationColumn1712000000000 implements MigrationInterface {
  name = 'DropEventLocationColumn1712000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // The `location` point column is no longer used.
    // Distance queries use the `latitude` and `longitude` columns via the Haversine formula.
    // MySQL 8.0 removed the AsText() function that TypeORM calls when reading point columns.
    const hasColumn = await queryRunner.hasColumn('events', 'location');
    if (hasColumn) {
      await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`location\`;`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('events', 'location');
    if (!hasColumn) {
      await queryRunner.query(`ALTER TABLE \`events\` ADD COLUMN \`location\` point NULL;`);
    }
  }
}
