class WheelBg extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, null)

    this.anchor.setTo(0.5)
    this.scale.setTo(0.5)
    this.angle = 105
  }
}

export default (game, radius, radian, segments) => {
  const key = 'wheel'
  const bmd = new Phaser.BitmapData(game, key, radius * 2, radius * 2)

  const wheel = new WheelBg(game, radius, radius)
  bmd.copy(wheel)

  for (let i = 0; i < segments; i++) {
    // const textX = Math.cos((radian * i) + (radian / 2)) * (radius - 60)
    // const textY = Math.sin((radian * i) + (radian / 2)) * (radius - 60)
    // bmd.ctx.font = '12pt Arial'
    // bmd.ctx.fillStyle = 'white'
    // bmd.ctx.textAlign = 'center'
    // bmd.ctx.textBaseline = 'middle'
    // bmd.ctx.fillText(i + 1, textX + radius, textY + radius)
  }

  game.cache.addBitmapData(key, bmd)
  return game.cache.getBitmapData(key)
}
