import AnimationGame from '../AnimationGame'
import Boot from './states/Boot'
import Preload from './states/Preload'
import Main from './states/Main'
import Drawing from './states/Drawing'
import { get } from 'lodash'

export default class Animation extends AnimationGame {
  constructor({ width, height, parent, transparent, options }) {
    super(width, height, parent, transparent, options)

    this.state.add('Boot', Boot, false)
    this.state.add('Preload', Preload, false)
    this.mainState = this.state.add('Main', Main, false)
    this.state.add('Drawing', Drawing, false)

    this.state.start('Boot')
  }

  start(req) {
    const { lastBall } = req
    if (
      get(this.state, 'current', '') === 'Main' &&
      lastBall === this.mainState.lastBall + 1
    ) {
      return
    }

    this.state.start('Main', null, null, {
      lastBall: lastBall - 1
    })
  }

  play(req) {
    this.result = {
      num: parseInt(req.num, 10) - 1,
      type: parseInt(req.type, 10) - 1
    }
  }

  skip() {
    this.state.start('Drawing')
    this.animationEnd()
  }

  getCurrentState() {
    return get(this.state, 'current', '') || ''
  }

  updateDistribution(data) {
    const { distributionLayer } = this.mainState
    if (distributionLayer) distributionLayer.updateAll(data)
  }
}
