export interface ActivityLogInterface {
  createAt: string | null;
  updateAt: string | null;
  deleteAt: string | null;
  id: string;
  activityType: string;
  fixerId: string | null;
  userId: string;
  requestServiceId: string | null;
  requestConfirmId: string | null;
  note: string;
  imageUrl: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  temp: string | null;
} 