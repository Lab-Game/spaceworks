export function drawShip(ctx) {
  ctx.strokeStyle = "#aaaaaa";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(100, 100);
  ctx.stroke();
}
