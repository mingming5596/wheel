import { get } from 'lodash'
import LightLayer from '../objects/LightLayer'
import locales from '../objects/locales'

export default class Drawing extends Phaser.State {
  create() {
    this.locales = locales(this.game.opt.lang)

    const tileLayer = this.game.add.group()
    const bg_wheelfortune = new Phaser.Sprite(
      this.game,
      0,
      0,
      'bg_wheelfortune'
    )
    bg_wheelfortune.scale.setTo(0.5)
    tileLayer.add(bg_wheelfortune)

    this.lightLayer = new LightLayer(this.game)
    this.lightLayer.run()

    const bambooLayer = this.game.add.group()
    bambooLayer.create(0, 0, 'bg_bamboo')

    const wheelRotating = this.game.add.image(
      375,
      230,
      'wheelfortune_object_rotation'
    )
    wheelRotating.anchor.setTo(0.5)

    const pointer = this.game.add.image(375, 6, 'pointer')
    pointer.scale.setTo(0.5)
    pointer.anchor.setTo(0.5, 0)

    const pandaLayer = this.game.add.group()
    const pandaImg = new Phaser.Sprite(this.game, 375, 230, 'axis')
    pandaImg.scale.setTo(0.5)
    pandaImg.anchor.setTo(0.5)
    pandaImg.pivot.set(1, -7)
    pandaLayer.add(pandaImg)

    const distribution = this.game.add.group()
    const betarea_bg = new Phaser.Sprite(
      this.game,
      this.game.world.centerX,
      0,
      'betarea_bg'
    )
    const proportion_areabg = new Phaser.Sprite(
      this.game,
      this.game.world.centerX,
      0,
      'proportion_areabg'
    )
    betarea_bg.anchor.setTo(0.5, 0)
    proportion_areabg.anchor.setTo(0.5, 0)
    distribution.addMultiple([betarea_bg, proportion_areabg])
    distribution.y = 426

    const note = this.game.add.text(
      this.game.world.centerX,
      478,
      get(this.locales, 'resultNote', ''),
      {
        font: 'normal 14px Microsoft JhengHei, Arial',
        fill: '#ffffff'
      }
    )
    note.anchor.x = 0.5

    if (this.game.opt.hideDistr) {
      betarea_bg.visible = false
      proportion_areabg.visible = false
      note.visible = false
    }
  }
}
