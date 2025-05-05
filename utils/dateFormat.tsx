import dayjs from "dayjs";

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Không xác định";

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "Ngày không hợp lệ";

  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  });
};



export const formatDateTimeVN = (value: string | number | Date | undefined): string => {
  if (!value) return "Không xác định";

  const date = dayjs(value); // dayjs xử lý tốt với timestamp

  if (!date.isValid()) {
    console.log("❌ Không thể parse ngày:", value);
    return "Ngày không hợp lệ";
  }

  return date.format("HH:mm, DD/MM/YYYY");
};

export function formatTime(isoString) {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatDate(isoString) {
  const date = new Date(isoString);
  const day = date.getUTCDate(); // Ngày
  const month = date.getUTCMonth() + 1; // Tháng (JavaScript tính từ 0)
  const year = date.getUTCFullYear(); // Năm
  return `${day}/${month}/${year}`;
}

export function formatDateWithDay(isoString) {
  const date = new Date(isoString);

  const days = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  const dayOfWeek = days[date.getUTCDay()];

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getUTCFullYear();

  return `${dayOfWeek}, ${day}/${month}/${year}`;
}
