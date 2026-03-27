import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: 'mysql',
  password: 'mysql',
  database: 'events',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false
});