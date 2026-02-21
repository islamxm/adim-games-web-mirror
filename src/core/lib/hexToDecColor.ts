export const hexToDecColor = (hex?: string) => {
  const color = hex || "#ffffff";
  return Phaser.Display.Color.ValueToColor(color).color;
};
