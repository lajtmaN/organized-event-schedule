export type AssetType = ReturnType<typeof parseAssetType>;
export const parseAssetType = (type: string) => {
  switch (type) {
    case "sponsor":
    case "logo":
      return type;
    default:
      throw new Error("Unsupported asset type: " + type);
  }
};
