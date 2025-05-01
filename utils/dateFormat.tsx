export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
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
