import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  ProjectStatus,
  ResetPasswordToken,
  VerificationToken,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserWithPasswordResponseDto } from './dto/user-with-password.response-dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessageResponseDto } from './dto/message.response-dto';
import { MailService } from '../mail/mail.service';
import { UserResponseDto } from './dto/user.response-dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { TooManyRequestsException } from '../shared/exceptions/too-many-requests.exception';
import { RolesService } from '../roles/roles.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserMapper } from '../shared/mappers/user.mapper';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProjectsService } from '../projects/projects.service';
import { ProjectsListResponseDto } from '../projects/dto/projects-list.response-dto';
import { UsersListResponseDto } from './dto/users-list.response-dto';
import { ParticipationsService } from '../participations/participations.service';
import { ProjectParticipationResponseDto } from '../participations/dto/project-participation.response-dto';
import { LoggerService } from '../logger/logger.service';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { EmailValidationResponseDto } from './dto/email-validation.response-dto';
import { TokenValidationResponseDto } from './dto/token-validation.response-dto';

interface GetUsersOptionsInterface {
  activeProjectsCount: number;
  specializationIds: string[];
  page: number;
  limit: number;
}

@Injectable()
export class UsersService {
  public constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private rolesService: RolesService,
    private cloudinaryService: CloudinaryService,
    private projectsService: ProjectsService,
    private participationsService: ParticipationsService,
    private loggerService: LoggerService,
    private authService: AuthService,
  ) {}

  public async createUser(
    createUserDto: CreateUserDto,
    ip: string,
  ): Promise<UserResponseDto> {
    return this.prisma.$transaction(async (prisma) => {
      const role = await this.rolesService.findOrCreateRole('user', prisma);

      try {
        const user = await prisma.user.create({
          data: {
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            email: createUserDto.email,
            password: createUserDto.password,
            avatarUrl: this.cloudinaryService.getUrl('avatars/avatar_beta'),
            role: {
              connect: { id: role.id },
            },
          },
          include: {
            role: true,
            educations: {
              include: {
                specialization: true,
              },
            },
            socials: true,
            softSkills: true,
            hardSkills: true,
          },
        });

        return UserMapper.toFullResponse(user, false);
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          await this.loggerService.log(
            ip,
            createUserDto.email,
            'registration',
            'User with this email already exists',
          );
          throw new ConflictException('User with this email already exists');
        }

        await this.loggerService.log(
          ip,
          createUserDto.email,
          'registration',
          'Something went wrong. Please try again later',
        );

        throw error;
      }
    });
  }

  public async getUserByEmail(
    email: string,
    withPassword: boolean,
  ): Promise<UserWithPasswordResponseDto | UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        educations: {
          include: {
            specialization: true,
          },
        },
        socials: true,
        softSkills: true,
        hardSkills: true,
      },
    });

    return user ? UserMapper.toFullResponse(user, withPassword) : null;
  }

  public async getUserById(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id },
        include: {
          role: true,
          educations: {
            include: {
              specialization: true,
            },
          },
          socials: true,
          softSkills: true,
          hardSkills: true,
        },
      });

      return UserMapper.toFullResponse(user, false);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  public async createVerificationUrl(
    ip: string,
    email: string,
  ): Promise<VerificationToken> {
    const user = await this.getUserByEmail(email, false);

    if (!user) {
      await this.loggerService.log(
        ip,
        email,
        'confirmation email',
        'User with this email not found',
      );
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is confirmed');
    }

    const count = await this.prisma.verificationAttempt.count({
      where: { userId: user.id },
    });

    if (count >= 5) {
      await this.loggerService.log(
        ip,
        email,
        'confirmation email',
        'You have used up all your attempts. Please try again later.',
      );
      throw new TooManyRequestsException(
        'You have used up all your attempts. Please try again later.',
      );
    }

    const data = { id: user.id, email: user.email };
    const createdAt = new Date();
    const token = this.jwtService.sign(data, {
      expiresIn: this.configService.get('EXPIRE_TIME_VERIFY_EMAIL_TOKEN'),
    });

    return this.prisma.$transaction(async (prisma) => {
      const verificationToken = await prisma.verificationToken.upsert({
        where: { userId: user.id },
        update: {
          token,
          createdAt,
        },
        create: {
          userId: user.id,
          token,
          createdAt,
        },
      });

      await prisma.verificationAttempt.create({
        data: {
          userId: user.id,
          createdAt,
        },
      });

      return verificationToken;
    });
  }

  public async sendVerificationUrl(
    ip: string,
    email: string,
  ): Promise<MessageResponseDto> {
    const record = await this.createVerificationUrl(ip, email);
    const params = new URLSearchParams({
      token: record.token,
      email: email,
    });
    const url = `${this.configService.get('BASE_FRONTEND_URL')}/verify-email?${params.toString()}`;

    this.mailService.sendVerificationMail(email, url).catch((err) => {
      console.error('Error sending verification url:', err);
    });

    await this.loggerService.log(
      ip,
      email,
      'confirmation email',
      'Confirmation email sent successfully',
    );

    return { message: 'Confirmation email sent. Please check your inbox.' };
  }

  public async confirmEmail(
    ip: string,
    confirmEmailDto: ConfirmEmailDto,
    req: Request,
    res: Response,
  ): Promise<MessageResponseDto> {
    const { token, email } = confirmEmailDto;

    const verificationToken = await this.prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      const decoded = this.jwtService.decode(token) as {
        id?: string;
        email?: string;
      } | null;

      if (decoded?.id) {
        const user = await this.getUserById(decoded.id).catch(() => null);
        if (!user) {
          await this.loggerService.log(
            ip,
            decoded.email ?? '',
            'confirmation email',
            'User not found',
          );
          throw new NotFoundException('User not found');
        }

        await this.loggerService.log(
          ip,
          decoded.email ?? '',
          'confirmation email',
          'Invalid or expired verification token',
        );
      } else {
        await this.loggerService.log(
          ip,
          '',
          'confirmation email',
          'Invalid or expired verification token',
        );
      }

      throw new BadRequestException('Invalid or expired verification token');
    }

    let payload: { id: string; email: string };
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const decoded = this.jwtService.decode(token) as {
          id?: string;
          email?: string;
        } | null;

        if (!decoded?.id) {
          await this.loggerService.log(
            ip,
            '',
            'confirmation email',
            'Invalid or expired verification token',
          );
          throw new BadRequestException(
            'Invalid or expired verification token',
          );
        }

        const user = await this.getUserById(decoded.id).catch(() => null);
        if (!user) {
          await this.loggerService.log(
            ip,
            decoded.email ?? '',
            'confirmation email',
            'User not found',
          );
          throw new NotFoundException('User not found');
        }

        await this.loggerService.log(
          ip,
          decoded.email ?? '',
          'confirmation email',
          'Invalid or expired verification token',
        );
        throw new BadRequestException('Invalid or expired verification token');
      }

      throw new BadRequestException('Invalid or expired verification token');
    }

    if (payload.email !== email) {
      await this.loggerService.log(
        ip,
        email,
        'confirmation email',
        'Email does not match token',
      );
      throw new BadRequestException(
        'Email does not match token',
        'Validation Error',
      );
    }

    if (!verificationToken.userId) {
      await this.loggerService.log(
        ip,
        payload.email,
        'confirmation email',
        'User not found',
      );
      throw new NotFoundException('User not found');
    }

    const userId = verificationToken.userId;

    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.verificationToken.delete({
          where: { token },
        });

        await prisma.user.update({
          where: { id: userId },
          data: { isVerified: true },
        });

        await this.loggerService.log(
          ip,
          payload.email,
          'confirmation email',
          'Email verified successfully',
        );
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        await this.loggerService.log(
          ip,
          payload.email,
          'confirmation email',
          'User not found',
        );
        throw new NotFoundException('User not found');
      }

      throw new BadRequestException('Invalid or expired verification token');
    }

    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    await this.authService.clearTokens(accessToken, refreshToken, res);

    return { message: 'Email verified successfully' };
  }

  public async sendPasswordResetUrl(
    ip: string,
    email: string,
  ): Promise<MessageResponseDto> {
    const record = await this.createPasswordResetUrl(ip, email);
    const params = new URLSearchParams({
      token: record.token,
    });
    const url = `${this.configService.get('BASE_FRONTEND_URL')}/reset-password?${params.toString()}`;

    this.mailService.sendResetPasswordMail(email, url).catch((err) => {
      console.error('Error sending verification url:', err);
    });

    await this.loggerService.log(
      ip,
      email,
      'reset password',
      'Password reset link sent successfully',
    );

    return { message: 'Password reset link has been sent to your email.' };
  }

  public async createPasswordResetUrl(
    ip: string,
    email: string,
  ): Promise<ResetPasswordToken> {
    const user = await this.getUserByEmail(email, false);

    if (!user) {
      await this.loggerService.log(
        ip,
        email,
        'reset password',
        'User with this email not found',
      );
      throw new NotFoundException('User not found');
    }

    const count = await this.prisma.resetPasswordAttempt.count({
      where: { userId: user.id },
    });

    if (count >= 5) {
      await this.loggerService.log(
        ip,
        email,
        'reset password',
        'You have used up all your attempts. Please try again later',
      );
      throw new TooManyRequestsException(
        'You have used up all your attempts. Please try again later',
      );
    }

    const data = { id: user.id, email: user.email };
    const createdAt = new Date();
    const token = this.jwtService.sign(data, {
      expiresIn: this.configService.get('EXPIRE_TIME_REFRESH_PASSWORD_TOKEN'),
    });

    return this.prisma.$transaction(async (prisma) => {
      const resetPasswordToken = await prisma.resetPasswordToken.upsert({
        where: { userId: user.id },
        update: {
          token,
          createdAt,
        },
        create: {
          userId: user.id,
          token,
          createdAt,
        },
      });

      await prisma.resetPasswordAttempt.create({
        data: {
          userId: user.id,
          createdAt,
        },
      });

      return resetPasswordToken;
    });
  }

  public async resetPassword(
    ip: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    const resetPasswordToken = await this.prisma.resetPasswordToken.findUnique({
      where: { token: resetPasswordDto.token },
    });

    if (!resetPasswordToken) {
      throw new BadRequestException('Invalid or expired token');
    }

    await this.prisma.$transaction(async (prisma) => {
      try {
        const payload = this.jwtService.verify(resetPasswordToken.token);
        const userId = payload.id;
        const hashPassword = await bcrypt.hash(resetPasswordDto.password, 10);

        await prisma.resetPasswordToken.delete({ where: { userId } });
        const user = await prisma.user.update({
          where: { id: resetPasswordToken.userId },
          data: { password: hashPassword },
        });
        await this.loggerService.log(
          ip,
          user.email,
          'reset password',
          'Password reset successfully',
        );
      } catch (error) {
        const payload = this.jwtService.verify(resetPasswordToken.token);
        const email = payload.email;
        await this.loggerService.log(
          ip,
          email,
          'reset password',
          'Invalid or expired token',
        );
        if (error.name === 'TokenExpiredError') {
          throw new BadRequestException('Invalid or expired token');
        }
      }
    });

    return { message: 'Password has been reset successfully.' };
  }

  public async createOrUpdateGoogleUser(
    ip: string,
    createGoogleUserDto: CreateGoogleUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.getUserByEmail(createGoogleUserDto.email, false);
    let updatedUser: UserResponseDto;

    if (!user) {
      const role = await this.rolesService.findOrCreateRole('user');

      const userFromDB = await this.prisma.user.create({
        data: {
          firstName: createGoogleUserDto.firstName,
          lastName: createGoogleUserDto.lastName,
          email: createGoogleUserDto.email,
          googleId: createGoogleUserDto.googleId,
          avatarUrl: this.cloudinaryService.getUrl('avatars/avatar_beta'),
          role: {
            connect: { id: role.id },
          },
        },
        include: {
          role: true,
          educations: {
            include: {
              specialization: true,
            },
          },
          socials: true,
          softSkills: true,
          hardSkills: true,
        },
      });
      updatedUser = UserMapper.toFullResponse(userFromDB, false);
    } else if (user && !user.googleId) {
      const userFromDB = await this.prisma.user.update({
        where: { email: createGoogleUserDto.email },
        data: { googleId: createGoogleUserDto.googleId },
        include: {
          role: true,
          educations: {
            include: {
              specialization: true,
            },
          },
          socials: true,
          softSkills: true,
          hardSkills: true,
        },
      });
      updatedUser = UserMapper.toFullResponse(userFromDB, false);
    } else {
      updatedUser = user;
    }

    if (!updatedUser.isVerified) {
      const record = await this.createVerificationUrl(ip, updatedUser.email);
      const params = new URLSearchParams({
        token: record.token,
        email: updatedUser.email,
      });
      const url = `${this.configService.get('BASE_FRONTEND_URL')}/verify-email?${params.toString()}`;

      this.mailService
        .sendVerificationMail(updatedUser.email, url)
        .catch((err) => {
          console.error('Error sending verification url:', err);
        });
    }

    return updatedUser;
  }

  public async updateUser(
    id: string,
    ip: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.getUserById(id);
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        include: {
          role: true,
          educations: {
            include: {
              specialization: true,
            },
          },
          socials: true,
          softSkills: true,
          hardSkills: true,
        },
      });

      if (user.email !== updatedUser.email) {
        const record = await this.createVerificationUrl(ip, updatedUser.email);
        const params = new URLSearchParams({
          token: record.token,
          email: updatedUser.email,
        });
        const url = `${this.configService.get('BASE_FRONTEND_URL')}/verify-email?${params.toString()}`;

        this.mailService
          .sendVerificationMail(updatedUser.email, url)
          .catch((err) => {
            console.error('Error sending verification url:', err);
          });
      }

      return UserMapper.toFullResponse(updatedUser, false);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new NotFoundException('User not found');
          case 'P2002':
            throw new ConflictException('Email is already in use');
          default:
            throw new InternalServerErrorException('Database error');
        }
      } else {
        throw error;
      }
    }
  }

  public async getUserProjects(
    userId: string,
    page = 1,
    limit = 20,
    status?: ProjectStatus,
  ): Promise<ProjectsListResponseDto> {
    return this.projectsService.getProjects({ userId, page, limit, status });
  }

  public async getUsers(
    options: Partial<GetUsersOptionsInterface>,
  ): Promise<UsersListResponseDto> {
    const {
      activeProjectsCount,
      specializationIds,
      page = 1,
      limit = 20,
    } = options;

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      isVerified: true,
      ...(specializationIds?.length
        ? {
            educations: {
              some: {
                specializationId: { in: specializationIds },
              },
            },
          }
        : {}),
      ...(typeof activeProjectsCount === 'number'
        ? {
            activeProjectsCount: activeProjectsCount,
          }
        : {}),
    };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        include: {
          educations: {
            include: {
              specialization: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      total,
      users: users.map((user) => UserMapper.toCardResponse(user)),
    };
  }

  public async getInvites(
    userId: string,
  ): Promise<ProjectParticipationResponseDto[]> {
    return this.participationsService.getInvitesWithProjects(userId);
  }

  public async getRequests(
    userId: string,
    ownerId?: string,
  ): Promise<ProjectParticipationResponseDto[]> {
    return this.participationsService.getRequestsWithProjects(userId, ownerId);
  }

  public async linkDiscord(id: string, discordId: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { discordId },
        include: {
          role: true,
          educations: {
            include: {
              specialization: true,
            },
          },
          socials: true,
          softSkills: true,
          hardSkills: true,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  public async checkEmailAvailable(
    email: string,
  ): Promise<EmailValidationResponseDto> {
    const user = await this.getUserByEmail(email, false);
    return { isAvailable: !user, isConfirmed: !!user?.isVerified };
  }

  public async validateToken(
    token: string,
  ): Promise<TokenValidationResponseDto> {
    try {
      const resetPasswordToken =
        await this.prisma.resetPasswordToken.findUnique({
          where: { token },
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        });
      return resetPasswordToken
        ? {
            isValid: true,
            firstName: resetPasswordToken.user.firstName,
            lastName: resetPasswordToken.user.lastName,
          }
        : { isValid: false };
    } catch {
      return { isValid: false };
    }
  }

  public async cancelResetPassword(token: string): Promise<void> {
    try {
      await this.prisma.resetPasswordToken.delete({ where: { token } });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Token not found');
      }
      throw error;
    }
  }
}
