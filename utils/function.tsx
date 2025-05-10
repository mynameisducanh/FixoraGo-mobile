export const fetchLottieFile = async (data: any) => {
  try {
    const results = await Promise.allSettled(
      data.map(async (cat) => {
        try {
          const response = await fetch(cat.iconUrl);
          if (!response.ok) throw new Error(`Lỗi tải: ${cat.iconUrl}`);
          const json = await response.json();
          return { [cat.name]: json };
        } catch (error) {
          console.error(`Lỗi khi tải ${cat.iconUrl}:`, error);
          return null;
        }
      })
    );

    const validResults = results
      .filter((r) => r.status === "fulfilled" && r.value !== null)
      .map((r) => (r as PromiseFulfilledResult<any>).value);

    return Object.assign({}, ...validResults);
  } catch (error) {
    console.error("Lỗi chung:", error);
    return {};
  }
};

export const statusMap = {
  pending: {
    label: "Đang chờ xử lý",
    color: "text-yellow-500",
    icon: "hourglass-outline",
  },
  completed: {
    label: "Đã hoàn thành",
    color: "text-green-600",
    icon: "checkmark-circle-outline",
  },
  rejected: {
    label: "Đã bị từ chối",
    color: "text-red-500",
    icon: "close-circle-outline",
  },
  guarantee: {
    label: "Đang bảo hành",
    color: "text-blue-500",
    icon: "shield-checkmark-outline",
  },
  approved: {
    label: "Đã được nhận",
    color: "text-green-600",
    icon: "person-outline",
  },
};
