import { PrismaClient } from '@prisma/client';
import { permissions } from './seeders/permissions-data';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();


async function main() {
    // Seed permissions with slug
    const createdPermissions = await Promise.all(
        permissions.map(async (permission) => {
            return prisma.permission.upsert({
                where: { 
                    name: permission.name 
                },
                update: {},
                create: {
                    name: permission.name,
                    description: permission.description,
                    slug: permission.slug,
                },
            });
        }),
    );

    const superAdminRole = await prisma.role.upsert({
        where: { name: 'super admin' },
        update: {},
        create: {
            name: 'super admin',
            slug: 'super-admin',
            canDelete: false, // Cannot delete this role
            canUpdate: false,
            permissions: { connect: createdPermissions },
        },
    });

    // Seed "user" role
    const userRole = await prisma.role.upsert({
        where: { name: 'user' },
        update: {},
        create: {
            name: 'user',
            slug: 'user',
            canDelete: false,
        },  
    });

    
    const hashedPassword = await bcrypt.hash('superadminpassword', 10);

    // Seed a super admin user
    await prisma.user.upsert({
        where: { email: 'superadmin@domain.com' },
        update: {},
        create: {
            email: 'superadmin@domain.com',
            password: hashedPassword,
            name: 'Super Admin',
            roleId: superAdminRole.id,
        },
    });

    console.log('Seeding completed!');
}

// Run the seeding process
main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
