import Api from "@/api/api";

class ReviewApi extends Api {
  constructor() {
    super("service-reviews");
  }

  async createReview(body: any) {
    return this.request("post", "/", body);
  }

  async getReviewAverageByFixerId(fixerId: string) {
    return this.request("get", `/fixer/${fixerId}/average`);
  }
  
  async checkUserReview(requestServiceId: string) {
    return this.request("get", `/check-review/${requestServiceId}`);
  }
}

export default ReviewApi;
