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
    color: "text-green-500",
    icon: "person-outline",
  },
};
// Array of 13 predefined colors for avatar backgrounds
export const AVATAR_COLORS = [
  "#FFEEAD", // Yellow
  "#F1C40F", // Yellow
];

// Function to get random color from AVATAR_COLORS
export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * AVATAR_COLORS.length);
  return AVATAR_COLORS[randomIndex];
};

// Function to get first letter from name, username or email
export const getInitials = (
  fullName?: string,
  username?: string,
  email?: string
) => {
  if (fullName) {
    return fullName.charAt(0).toUpperCase();
  }
  if (username) {
    return username.charAt(0).toUpperCase();
  }
  if (email) {
    return email.charAt(0).toUpperCase();
  }
  return "?";
};
