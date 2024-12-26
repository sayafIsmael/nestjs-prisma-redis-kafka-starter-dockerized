import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { generateSlug } from 'src/common/utils/helper';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return this.prisma.role.create({
      data: {
        name,
        slug,
        canDelete: true,
        permissions: {
          connect: createRoleDto.permissions.map((id) => ({ id })),
        },
      },
    });
  }

  async findAll() {
    return this.prisma.role.findMany({
      include: {
        permissions: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const { name, permissions } = updateRoleDto;
  
    // Fetch existing role with permissions
    const existingRole = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });
  
    if (!existingRole) {
      throw new Error('Role not found');
    }
  
    if (!existingRole.canUpdate) {
      throw new Error('Role can not be updated');
    }

    // Prepare `connect` and `disconnect` operations
    const existingPermissionIds = existingRole.permissions.map((perm) => perm.id);
  
    const permissionsToConnect = permissions
      ? permissions.filter((permId) => !existingPermissionIds.includes(permId))
      : [];
  
    const permissionsToDisconnect = permissions
      ? existingPermissionIds.filter((permId) => !permissions.includes(permId))
      : [];
  
    // Update the role
    return this.prisma.role.update({
      where: { id },
      data: {
        name: name || existingRole.name, // Update name only if provided
        slug: name ? await generateSlug(name) : existingRole.slug,
        permissions: {
          connect: permissionsToConnect.map((id) => ({ id })),
          disconnect: permissionsToDisconnect.map((id) => ({ id })),
        },
      },
      include: { permissions: true }, // Return the updated role with its permissions
    });
  }
  

  async remove(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    if (!role.canDelete) {
      throw new ForbiddenException('This role cannot be deleted');
    }

    return this.prisma.role.delete({
      where: { id },
    });
  }
}
