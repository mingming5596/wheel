class Rect extends Phaser.BitmapData {
  constructor(game, key, width, height, color) {
    super(game, key, width, height)

    this.ctx.beginPath()
    this.ctx.fillStyle = color
    this.ctx.rect(0, 0, width, height)
    this.ctx.closePath()
    this.ctx.fill()

    game.cache.addBitmapData(key, this)
    return game.cache.getBitmapData(key)
  }
}

class Semicircular extends Phaser.BitmapData {
  constructor(game, key, width, height, color, dire = 'left') {
    super(game, key, width, height)

    this.ctx.beginPath()
    this.ctx.fillStyle = color
    if (dire === 'left')
      this.ctx.arc(width, width, width, Math.PI * 0.5, Math.PI * 1.5)
    if (dire === 'right')
      this.ctx.arc(0, width, width, Math.PI * 1.5, Math.PI * 0.5)
    this.ctx.closePath()
    this.ctx.fill()

    game.cache.addBitmapData(key, this)
    return game.cache.getBitmapData(key)
  }
}

export default class ProgressBar extends Phaser.Sprite {
  constructor(game, x, y, key, options) {
    super(game, x, y, key)

    this.opt = options
    this.minWidth = this.opt.height

    if (!this.opt) {
      throw new Error('缺少必要屬性')
    }

    this.semicircularLeft = new Phaser.Sprite(
      this.game,
      0,
      0,
      new Semicircular(
        this.game,
        'semicircularLeft',
        this.opt.height / 2,
        this.opt.height,
        this.opt.color
      )
    )
    this.semicircularRight = new Phaser.Sprite(
      this.game,
      0,
      0,
      new Semicircular(
        this.game,
        'semicircularRight',
        this.opt.height / 2,
        this.opt.height,
        this.opt.color,
        'right'
      )
    )
    this.rect = new Phaser.Sprite(
      this.game,
      0,
      0,
      new Rect(
        this.game,
        'rect',
        this.opt.width - this.opt.height,
        this.opt.height,
        this.opt.color
      )
    )

    this.rect.width = 0
    this.rect.left = this.semicircularLeft.width

    this.updateDistr(this.opt.percent)

    this.addChild(this.semicircularLeft)
    this.addChild(this.semicircularRight)
    this.addChild(this.rect)

    this.children.forEach((sprite) => {
      sprite.anchor.setTo(0, 0.5)
    })
  }

  updateDistr(data) {
    const fullWidth = () => {
      if (data <= this.minWidth) return 0
      return this.opt.width * data / 100 - this.opt.height
    }

    const semicirRightPos = () => {
      const pos = (this.semicircularRight.left =
        this.rect.width + this.opt.height / 2)
      return pos
    }

    const introTween = this.game.add.tween(this.rect)
    introTween.to({ width: fullWidth() }, 500, null)
    introTween.onUpdateCallback(() => {
      semicirRightPos()
    }, this)

    // 消除落差
    introTween.onComplete.add(() => {
      semicirRightPos()
    })

    introTween.start()
  }
}
