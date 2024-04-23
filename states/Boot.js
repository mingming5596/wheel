import BootState from '../../BootState'

export default class Boot extends BootState {
  preload() {
    if (this.game.opt && this.game.opt.baseURL) {
      this.game.load.baseURL = `${this.game.opt.baseURL}/`
      this.game.load.crossOrigin = 'anonymous'
    }
    this.game.load.image('logo', 'img/game/loadingbg.png')
  }

  create() {
    if (this.game.opt && this.game.opt.baseURL) {
      this.game.load.baseURL = `${this.game.opt.baseURL}/`
      this.game.load.crossOrigin = 'anonymous'
    }

    // blur
    this.game.stage.visibilityChange = (event) => {
      if (event.type.includes('visibilitychange') && this.game.info.gameStart) {
        this.game.skipCallback(this)
        this.game.skip()
      }
    }

    this.sound.mute = this.game.opt.isMute

    this.state.start('Preload')
  }
}
