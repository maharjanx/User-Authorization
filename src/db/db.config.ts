import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const databaseConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: "localhost",
  port: 3000,
  username: "postgres",
  password: "0000",
  database: "user_authorization_authentication",
  autoLoadEntities: true,
  synchronize: true,
};
