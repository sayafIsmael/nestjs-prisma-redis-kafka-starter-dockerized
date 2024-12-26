import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if(!request.user){
      return false;
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: request.user.sub
      }
    });

    const role = await this.prisma.role.findFirst({
      where: { id: user.roleId },
      include: { permissions: true },
    });

    if (!role) {
      return false;
    }

    // Check if the user's role has all the required permissions
    const hasPermission = requiredPermissions.every((permission) =>
      role.permissions.some((p) => p.slug === permission),
    );

    return hasPermission;
  }
}
