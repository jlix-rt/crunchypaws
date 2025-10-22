import { DataSource } from 'typeorm';
import { config } from './config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: config.database.synchronize,
  logging: config.database.logging,
  entities: [__dirname + '/../entities/*.ts'],
  migrations: [__dirname + '/../migrations/*.ts'],
  subscribers: [__dirname + '/../subscribers/*.ts'],
  charset: 'utf8mb4',
  timezone: '-06:00',
  extra: {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
  },
});

export default AppDataSource;




