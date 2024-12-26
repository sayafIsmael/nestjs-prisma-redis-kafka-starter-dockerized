import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from '../core-modules/auth/auth.module';

@Module({
  imports: [CommonModule, AuthModule],
  controllers: [RoleController],
  providers: [RoleService]
})
export class RoleModule {}
