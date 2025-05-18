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
