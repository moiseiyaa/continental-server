export interface MagicLinkToken {
  token: string;
  userId: string;
  expiresAt: Date;
  used: boolean;
}
