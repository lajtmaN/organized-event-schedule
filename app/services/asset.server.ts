import { prisma } from "~/db.server";
import type { AssetType } from "~/models/asset-type";
import { parseAssetType } from "~/models/asset-type";

export const getAllAssets = async () => {
  const assets = await prisma.asset.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      url: true,
    },
  });
  return assets.map((asset) => ({
    ...asset,
    type: parseAssetType(asset.type),
  }));
};

export const getAssetsOfType = async (type: AssetType) => {
  const assets = await prisma.asset.findMany({
    where: { type },
    select: {
      id: true,
      name: true,
      type: true,
      url: true,
    },
  });
  return assets.map((asset) => ({
    ...asset,
    type: parseAssetType(asset.type),
  }));
};
