import Api from "@/api/api";

class UserApi extends Api {
  constructor() {
    super("users");
  }

  async getByUserId(id: string) {
    return this.request("get", `/${id}`);
  }

  async verifyOtp(email: string, otp: string) {
    return this.request("post", "/validate", { email, otp });
  }
}

export default UserApi;
