export interface TokenI {
  accessToken: string;
  refreshToken: string;
}

export interface LoginI {
  email: string;
  password: string;
  subsidiaryCode: string;
}

export interface RegisterI {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}