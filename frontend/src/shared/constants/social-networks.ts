import { ClientSocialInterface } from '@/shared/interfaces/social.interface';

export const socialNetworks: ClientSocialInterface[] = [
  {
    network: 'Facebook',
    url: 'https://www.facebook.com',
    icon: '/images/facebook.svg',
    urlRegex: /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/i,
  },
  {
    network: 'X Twitter',
    url: 'https://www.twitter.com',
    icon: '/images/x-twitter.svg',
    urlRegex: /^https:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/i,
  },
  {
    network: 'Instagram',
    url: 'https://www.instagram.com',
    icon: '/images/instagram.svg',
    urlRegex: /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/i,
  },
  {
    network: 'LinkedIn',
    url: 'https://www.linkedin.com/in',
    icon: '/images/linkedin.svg',
    urlRegex: /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/i,
  },
  {
    network: 'Discord',
    url: 'https://www.discord.com/users',
    icon: 'images/discord.svg',
    urlRegex: /^https:\/\/(www\.)?discord\.com\/users\/\d+\/?$/i,
  },
  {
    network: 'Telegram',
    url: 'https://t.me',
    icon: 'images/telegram.svg',
    urlRegex: /^https:\/\/t\.me\/[a-zA-Z0-9_]+\/?$/i,
  },
  {
    network: 'GitHub',
    url: 'https://github.com',
    icon: 'images/github.svg',
    urlRegex: /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/i,
  },
  {
    network: 'GitLab',
    url: 'https://gitlab.com',
    icon: 'images/gitlab.svg',
    urlRegex: /^https:\/\/(www\.)?gitlab\.com\/[a-zA-Z0-9_-]+\/?$/i,
  },
  {
    network: 'YouTube',
    url: 'https://www.youtube.com',
    icon: 'images/youtube.svg',
    urlRegex:
      /^https:\/\/(www\.)?youtube\.com\/(@[\w.-]+|c\/[\w-]+|channel\/UC[a-zA-Z0-9_-]{21,})\/?$/i,
  },
];
