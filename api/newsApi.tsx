import Api from "@/api/api";

export interface News {
  id: string;
  title: string;
  content: string;
  image: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

class NewsApi extends Api {
  constructor() {
    super("news");
  }

  async getAllNews(): Promise<News[]> {
    return this.request("GET", "/");
  }

  async getNewsById(id: string): Promise<News> {
    return this.request("GET", `/${id}`);
  }
}

export default NewsApi;
