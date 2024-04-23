export default class LightLayer extends Phaser.Group {
  constructor(game, x, y) {
    super(game, game.world, 'LightLayer')

    this.run_shine = new Phaser.Sprite(this.game, 0, 0, 'light_run_shine')
    this.run_white = new Phaser.Sprite(this.game, 0, 0, 'light_run_white')
    this.run_yellow = new Phaser.Sprite(this.game, 0, 0, 'light_run_yellow')
    this.start_normal = new Phaser.Sprite(this.game, 0, 0, 'light_start_normal')
    this.start_shine = new Phaser.Sprite(this.game, 0, 0, 'light_start_shine')
    this.win_normal = new Phaser.Sprite(this.game, 0, 0, 'light_win_normal')
    this.win_shine = new Phaser.Sprite(this.game, 0, 0, 'light_win_shine')

    this.x = 375
    this.y = 230

    this.lightRadius = 500

    this.type = {
      run: this.createAnim('lightRun', [
        this.run_shine,
        this.run_yellow,
        this.run_white
      ]),
      start: this.createAnim('lightStart', [
        this.start_shine,
        this.start_normal
      ]),
      win: this.createAnim('lightWin', [this.win_normal, this.win_shine])
    }
  }

  run() {
    this.removeAll()
    this.addChild(this.type.run)
    this.type.run.play('shine', 3, true)

    return this.type.run
  }

  start() {
    this.removeAll()
    this.addChild(this.type.start)
    this.type.start.play('shine', 4, true)

    return this.type.start
  }

  win() {
    this.removeAll()
    this.addChild(this.type.win)
    this.type.win.play('shine', 4, true)

    return this.type.win
  }

  createAnim(animKey, spriteAry) {
    const frameLength = spriteAry.length
    const bmd = new Phaser.BitmapData(
      this.game,
      animKey,
      this.lightRadius * 2 * frameLength,
      this.lightRadius * 2
    )

    spriteAry.forEach((l, i) => {
      const x = i * this.lightRadius * 2
      bmd.draw(l, x, 0)
    })

    this.game.cache.addSpriteSheet(
      animKey,
      '',
      bmd.canvas,
      this.lightRadius * 2,
      this.lightRadius * 2,
      frameLength,
      0,
      0
    )

    const anim = new Phaser.Sprite(this.game, 0, 0, animKey)
    anim.scale.setTo(0.5)
    anim.anchor.setTo(0.5)
    anim.animations.add('shine')

    return anim
  }
}
