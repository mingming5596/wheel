export default (game, k) => {
  const bmd = new Phaser.BitmapData(game, k, 42, 42)

  const pointer = new Phaser.Sprite(game, 0, 0, null)
  pointer.scale.setTo(0.5)
  bmd.copy(pointer)

  // bmd.ctx.beginPath();
  // bmd.ctx.fillStyle = '#db9e36';
  // bmd.ctx.moveTo(0, 0);
  // bmd.ctx.lineTo(12, 0);
  // bmd.ctx.lineTo(6, 34);
  // bmd.ctx.closePath();
  // bmd.ctx.fill();

  game.cache.addBitmapData(k, bmd)
  return game.cache.getBitmapData(k)
}
