import Api from "@/api/api";

class ApiIconsLottie extends Api {
  constructor() {
    super("icons");
  }

  async getLottie() {
    return this.request("GET", "/lottieIcon");
  }
}

export default ApiIconsLottie;