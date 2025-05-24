import { RegisterInterface, SignInInterface } from "@/types/auth";
import Api from "./api";

class ChatApi extends Api {
  constructor() {
    super("chat");
  }
  async getAllByUserId(userId: string) {
    return this.request("get", `/user/${userId}`);
  }

  async getAllByFixerId(staffId: string) {
    return this.request("get", `/fixer/${staffId}`);
  }
  
  async getDetailByChatRoomId(id: string) {
    return this.request("get", `/room/${id}`);
  }
}

export default ChatApi;
