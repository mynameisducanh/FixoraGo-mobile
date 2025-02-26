import Api from "@/api/api";

class ApiOtp extends Api {
  constructor() {
    super("otp");
  }

  async sendOtp(email: string) {
    return this.request("post", "/create", { email });
  }

  async verifyOtp(email: string, otp: string) {
    return this.request("post", "/validate", { email, otp });
  }
}

export default ApiOtp;
