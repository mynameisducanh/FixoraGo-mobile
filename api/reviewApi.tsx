import Api from "@/api/api";

class ReviewApi extends Api {
  constructor() {
    super("service-reviews");
  }

  async createReview(body: any) {
    return this.request("post", "/", body);
  }

  async verifyOtp(email: string, otp: string) {
    return this.request("post", "/validate", { email, otp });
  }
}

export default ReviewApi;
