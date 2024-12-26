import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SecurityConfig } from 'src/config/config.interface';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from '@prisma/client';
import { SignupDto } from '../auth/dto/signup.dto';
import { OauthSignUpDto } from '../auth/dto/oauthSignup.dto';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class UserService {
    private securityConfig: SecurityConfig;

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService
    ) {
        this.securityConfig = this.configService.get<SecurityConfig>('security');
    }

    async findUserById(id: string) {
        return this.prisma.user.findUnique({
            where: { id }
        });
    }

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email }
        });
    }

    async getDefaultUserRole() {
        return await this.prisma.role.findUnique({
            where: {
                slug: 'user'
            }
        })
    }

    async createUser(signupDto: SignupDto) {
        const { name, email, password } = signupDto
        const hashedPassword = await bcrypt.hash(password, this.securityConfig.bcryptSaltOrRound);
        const role = await this.getDefaultUserRole()
        return this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roleId: role.id
            }
        });
    }

    async createOauthUser(payload: OauthSignUpDto, authProvider: AuthProvider) {
        const role = await this.getDefaultUserRole()
        return this.prisma.user.create({
            data: {
                email: payload.email,
                name: payload.name,
                authProvider,
                roleId: role.id
            }
        });
    }

    async updateRefreshToken(userId: string, refreshToken: string | null) {
        const hashedRefreshToken = refreshToken ? await bcrypt.hash(refreshToken, this.securityConfig.bcryptSaltOrRound) : null;
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashedRefreshToken },
        });
    }

    async validateRefreshToken(userId: string, refreshToken: string) {
        const user = await this.findUserById(userId);
        if (!user || !user.refreshToken) return false;
        return bcrypt.compare(refreshToken, user.refreshToken);
    }
}
