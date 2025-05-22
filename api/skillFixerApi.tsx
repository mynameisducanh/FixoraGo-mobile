import { RegisterInterface, SignInInterface } from "@/types/auth";
import Api from "./api";

class SkillFixerApi extends Api {
  constructor() {
    super("skill-fixer");
  }

  async getByUserId(userId: string) {
    return this.request("get", `/user/${userId}`);
  }

//   async register(resource: RegisterInterface) {
//     return this.request("post", "/register", resource);
//   }
}

export default SkillFixerApi;
