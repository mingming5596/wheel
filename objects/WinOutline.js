export default class WinOutline extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'light')

    this.anchor.setTo(1, 0.5)
    this.pivot.x = -110

    this.anim = this.animations.add('shine')

    this.anim.frame = this.anim.frameTotal - 1
  }

  playWin() {
    this.anim.play(12)
  }
}
