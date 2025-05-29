import { RegisterInterface, SignInInterface } from "@/types/auth";
import Api from "./api";

class ActivityLogApi extends Api {
  constructor() {
    super("activity-logs");
  }

  async createRes(data: any) {
    return this.request("POST", "", data, {
      "Content-Type": "multipart/form-data",
    });
  }

  async CheckFixerCheckIn(fixerId: string) {
    return this.request("GET", `/check-fixer-checkin/${fixerId}`);
  }

  async GetAllBillByUserId(userId: string) {
    return this.request("GET", `/all/staff-payfee/${userId}`);
  }
}

export default ActivityLogApi;
