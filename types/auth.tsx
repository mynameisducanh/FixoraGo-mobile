export interface SignInInterface {
  username: string;
  password: string;
  latitude: number;
  longitude: number;
}

export interface RegisterInterface {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
