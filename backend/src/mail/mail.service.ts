import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import {
  Education,
  Project,
  ProjectRole,
  ProjectRoleType,
  SupportRequest,
  User,
} from '@prisma/client';
import { Participation } from '../shared/types/participation.type';

@Injectable()
export class MailService {
  public constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  public async sendVerificationMail(email: string, url: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `Support Team <${this.configService.get<string>('EMAIL_USER')}>`,
      subject: 'Підтвердження електронної пошти',
      template: './confirmation-email',
      context: { url },
    });
  }

  public async sendResetPasswordMail(
    email: string,
    url: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `Support Team <${this.configService.get<string>('EMAIL_USER')}>`,
      subject: 'Твоє посилання для відновлення паролю',
      template: './reset-password-email',
      context: { url },
    });
  }

  public async sendParticipationInvite(
    url: string,
    invite: Participation & {
      user: User & {
        educations: (Education & { specialization: ProjectRoleType })[];
        activeProjectsCount: number;
      };
      projectRole: ProjectRole & {
        roleType: ProjectRoleType;
        project: Project;
      };
    },
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: invite.user.email,
      from: `Support Team <${this.configService.get<string>('EMAIL_USER')}>`,
      subject: 'Запрошення в проєкт',
      template: './participation-invite',
      context: { url, invite },
    });
  }

  public async sendParticipationRequest(
    url: string,
    request: Participation & {
      projectRole: ProjectRole & {
        roleType: ProjectRoleType;
        project: Project & { owner: User };
      };
    },
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: request.projectRole.project.owner.email,
      from: `Support Team <${this.configService.get<string>('EMAIL_USER')}>`,
      subject: 'Запит на участь у твоєму проєкті',
      template: './participation-request',
      context: { url, request },
    });
  }

  public async sendSupportRequest(request: SupportRequest): Promise<void> {
    await this.mailerService.sendMail({
      to: request.email,
      from: `Support Team <${this.configService.get<string>('EMAIL_USER')}>`,
      subject: 'Твій запит на підтримку отримано',
      template: './support-request',
      context: { request },
    });
  }
}
