import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'events',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false
});