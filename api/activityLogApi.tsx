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

  async checkUserConfirmCheckin(fixerId: string) {
    return this.request("GET", `/check-user-confirm-checkin/${fixerId}`);
  }

  async GetAllBillByUserId(userId: string) {
    return this.request("GET", `/all/staff-payfee/${userId}`);
  }

  async findAllReportByUserId(userId: string) {
    return this.request("GET", `/all/user-report/${userId}`);
  }

  async findAllReportByFixerId(fixerId: string) {
    return this.request("GET", `/all/staff-report/${fixerId}`);
  }

  async getByRequestIdStaffCheckIn(requestId: string) {
    return this.request("GET", `/request-service/${requestId}/staff-checkin`);
  }

  async userConfirmCheckIn(id: string, temp: string) {
    return this.request("patch", `/update-temp-timestamp/${id}`, { temp });
  }
}

export default ActivityLogApi;
