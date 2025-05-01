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

