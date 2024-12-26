import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { PermissionsGuard } from 'src/common/guards/permissions/permissions.guard';
import { JwtAuthGuard } from '../core-modules/auth/guard/jwt-auth/jwt-auth.guard';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  
  @Post()
  @Permissions(['create-role']) 
  @UseGuards(PermissionsGuard)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }
  
  @Get()
  @Permissions(['view-role']) 
  @UseGuards(PermissionsGuard)
  async findAll() {
    const roles = await this.roleService.findAll();

    return roles || []; 
  }

  @Get(':id')
  @Permissions(['view-role']) 
  @UseGuards(PermissionsGuard)
  async findOne(@Param('id') id: string,) {
    const role = await this.roleService.findOne(id);

    if (!role) {
      throw new NotFoundException('No role found');
    }

    return role;
  }
  
  @Put(':id')
  @Permissions(['update-role'])
  @UseGuards(PermissionsGuard)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Permissions(['delete-role']) 
  @UseGuards(PermissionsGuard)
  async remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
