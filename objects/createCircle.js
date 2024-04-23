export default (game, key, r, color) => {
  const bmd = new Phaser.BitmapData(game, key, r * 2, r * 2)
  bmd.ctx.translate(r, r)
  bmd.ctx.beginPath()
  bmd.ctx.fillStyle = color
  bmd.ctx.arc(0, 0, r, 0, Math.PI * 2)
  bmd.ctx.fill()
  game.cache.addBitmapData(key, bmd)

  return game.cache.getBitmapData(key)
}
