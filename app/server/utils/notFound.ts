export const notFound = (message?: string) => {
  throw new Response(message ?? "Not found", {
    status: 404,
  });
};
