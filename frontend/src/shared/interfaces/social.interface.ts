export interface SocialInterface {
  id: string;
  network: string;
  url: string;
}

export interface ClientSocialInterface {
  network: string;
  url: string;
  icon: string;
  urlRegex: RegExp;
}
