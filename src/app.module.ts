import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./core/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "./db/db.config";
import { RoleModule } from "./core/role/role.module";
import { User } from "./core/users/entities/user.entity";
import { Role } from "./core/role/entities/role.entity";
import { UserRoleModule } from "./core/user-role/user-role.module";
import { UserRole } from "./core/user-role/entities/user-role.entity";
import { PrivilegeModule } from "./core/privilege/privilege.module";
import { MasterModulesModule } from "./core/master-modules/master-modules.module";
import { MasterModulePrivilegeModule } from "./core/master_module_privilege/master_module_privilege.module";
import { MasterScreensModule } from "./core/master_screens/master_screens.module";
import { InternalAccessModule } from './core/internal_access/internal_access.module';
import { MulterModule } from "./core/multer/multer.module";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([User, Role, UserRole]),
   
    UsersModule,
    RoleModule,
    UserRoleModule,
    PrivilegeModule,
    MasterModulesModule,
    MasterModulePrivilegeModule,
    MasterScreensModule,
    InternalAccessModule,
    MulterModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
