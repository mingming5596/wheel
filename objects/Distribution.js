import { isNumber, isNull } from 'lodash'
import ProgressBar from '../objects/ProgressBar'

export default class Distribution extends Phaser.Group {
  constructor(game, data) {
    super(game, game.world, 'Distribution')

    this.bar = {}
    this.num = {}

    this.barWidth = 260
    this.barHeight = 10

    this.group = [
      {
        name: 'purple',
        color: '#7760D5',
        x: this.game.world.centerX + 66,
        y: 28,
        numX: this.game.world.centerX + 48,
        numY: 32
      },
      {
        name: 'peach',
        color: '#CE1C7B',
        x: this.game.world.centerX - 66,
        y: 28,
        numX: this.game.world.centerX - 45,
        numY: 32
      }
    ]

    this.numStyle = {
      font: 'Bold 12px "Microsoft JhengHei", Arial',
      fill: '#000000',
      align: 'center'
    }

    // bg
    const bg = new Phaser.Sprite(
      this.game,
      this.game.world.centerX,
      0,
      'betarea_bg'
    )
    bg.anchor.setTo(0.5, 0)
    this.add(bg)

    this.group.forEach((g) => {
      this.bar[g.name] = new ProgressBar(this.game, g.x, g.y, null, {
        width: this.barWidth,
        height: this.barHeight,
        percent: data[g.name],
        color: g.color
      })

      this.add(this.bar[g.name])
    })
    this.bar.peach.angle = 180

    // vs bg
    const proportion = new Phaser.Sprite(
      this.game,
      this.game.world.centerX,
      0,
      'proportion_areabg'
    )
    proportion.anchor.setTo(0.5, 0)
    this.add(proportion)

    this.group.forEach((g) => {
      this.num[g.name] = new Phaser.Text(
        this.game,
        g.numX,
        g.numY,
        `${data[g.name].toFixed(2)}%`,
        this.numStyle
      )
      this.num[g.name].anchor.setTo(0.5)
      this.num[g.name].align = 'center'

      this.add(this.num[g.name])
    })

    this.y = 426
  }

  updateAll(data) {
    if (isNull(this.game) || this.game.info.gameStart) return
    this.group.forEach((g) => {
      if (!isNumber(data[g.name])) return
      this.bar[g.name].updateDistr(data[g.name])
      this.num[g.name].visible = true
      this.num[g.name].setText(`${data[g.name].toFixed(2)}%`)
    })
  }

  closeAll() {
    this.group.forEach((g) => {
      this.bar[g.name].updateDistr(0)
      this.num[g.name].visible = false
    })
  }
}
