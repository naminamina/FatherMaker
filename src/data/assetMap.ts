import type { FatherState, FatherTypeId } from "../types/father";

const fatherPngs = import.meta.glob("../assets/fathers/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const resolveFatherAsset = (type: FatherTypeId, state: FatherState) => {
  const key = `../assets/fathers/father-${type}-${state}.png`;
  return fatherPngs[key] || `/images/father-${type}-${state}.svg`;
};

export const assetMap = {
  father: (type: FatherTypeId, state: FatherState) => resolveFatherAsset(type, state),
};
