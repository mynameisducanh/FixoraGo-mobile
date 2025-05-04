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

export interface PricesServiceInterface {
  id: string;
  ServiceId: number;
  name: string;
  UnitService: string;
  price: string;
}

export interface RequestServiceInterface {
  userId: string;
  listDetailService: string;
  typeService: string;
  nameService: string;
  priceService: string;
  calender: string;
  note: string;
}
