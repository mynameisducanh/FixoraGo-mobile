export const formatPrice = (value: number | string) => {
  const numericValue =
    typeof value === "string" ? parseInt(value.replace(/[^0-9]/g, "")) : value;
  if (isNaN(numericValue)) return "";
  return new Intl.NumberFormat("vi-VN").format(numericValue);
};

export const getNumericPrice = (formattedPrice: string) => {
  return parseInt(formattedPrice.replace(/[^0-9]/g, "")) || 0;
};

export const getPriceSuggestions = (basePrice: string) => {
  if (!basePrice) return [];
  const num = parseInt(basePrice.replace(/[^0-9]/g, ""));
  if (isNaN(num)) return [];

  return [num * 1000, num * 10000, num * 100000].map((price) =>
    price.toString()
  );
};

export const formatDecimalToWhole = (value: number | string) => {
  if (!value) return "0";
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numericValue)) return "0";
  const wholeNumber = Math.floor(numericValue);
  return new Intl.NumberFormat("vi-VN").format(wholeNumber);
};
