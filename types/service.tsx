export interface ServiceInterface {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface ListDetailServiceInterface {
  id: number;
  serviceId: string;
  name: string;
  unit: string;
  type: string;
}

export interface PricesServiceInterface {
  id: string;
  ServiceId: string;
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
