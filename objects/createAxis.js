export default (game, k) => {
  const w = 1
  const bmd = new Phaser.BitmapData(game, k, w, w)
  bmd.ctx.beginPath()
  bmd.ctx.fillStyle = '#fec92b'
  bmd.ctx.rect(0, 0, w, w)
  // bmd.ctx.fill()
  game.cache.addBitmapData(k, bmd)
  return game.cache.getBitmapData(k)
}
