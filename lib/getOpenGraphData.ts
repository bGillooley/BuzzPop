export const getOpenGraphData = async (url) => {
  const res = await fetch(
    `https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?&app_id=${
      process.env.NEXT_PUBLIC_OPENGRAPH_API
    }`
  );
  const result = await res.json();
  return result;
};
