import { RegisterInterface, SignInInterface } from "@/types/auth";
import Api from "./api";

class AuthApi extends Api {
  constructor() {
    super("auth");
  }
  login(resource: SignInInterface) {
    return this.request("post", "/login", resource);
  }

  register(resource: RegisterInterface) {
    return this.request("post", "/register", resource);
  }

  resetPass(body: { username: string }) {
    return this.request("post", "/reset-password", body);
  }

  confirmOTPReset(body: {otp: string, email: string}) {
    return this.request("post", "/verify-otp-reset", body);
  }

  confirmResetPass(body: {password: string, token: string}) {
    return this.request("post", "/confirm-reset-password", body);
  }
}

export default AuthApi;
