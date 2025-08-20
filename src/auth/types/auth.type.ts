export interface JWTPayloadUser {
  sub: string;
  user_id: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

export interface UserInCache {
  user_id: string;
  name: string;
  email: string;
  is_2fa_active: boolean;
  access_token: string;
  refresh_token: string;
}
