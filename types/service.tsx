export interface ServiceInterface {
  id: number;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface ListDetailServiceInterface {
  id: number;
  serviceId: number;
  name: string;
  unit: string;
  type: string;
}
