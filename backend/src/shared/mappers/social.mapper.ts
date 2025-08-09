import { Social } from '@prisma/client';
import { SocialResponseDto } from '../../socials/dto/social.response-dto';

export class SocialMapper {
  public static toResponse(social: Social): SocialResponseDto {
    return {
      id: social.id,
      network: social.network,
      url: social.url,
    };
  }
}
