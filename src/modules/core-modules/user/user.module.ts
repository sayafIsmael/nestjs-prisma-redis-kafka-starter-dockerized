import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
