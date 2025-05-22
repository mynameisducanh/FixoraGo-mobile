import { RegisterInterface, SignInInterface } from "@/types/auth";
import Api from "./api";

class FixerApi extends Api {
  constructor() {
    super("fixer");
  }

  async getByUserId(userId: string) {
    return this.request("get", `/user/${userId}`);
  }

  async register(resource: RegisterInterface) {
    return this.request("post", "/register", resource);
  }
}

export default FixerApi;
