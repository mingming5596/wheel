/* global p2 */

import { isObject, indexOf, get } from 'lodash'
import createCircle from '../objects/createCircle'
import createWheel from '../objects/createWheel'
import createAxis from '../objects/createAxis'
import createArrow from '../objects/createArrow'
import getNum from '../objects/getNum'
import segmentCarry from '../objects/segmentCarry'
import Distribution from '../objects/Distribution'
import LightLayer from '../objects/LightLayer'
import WinOutline from '../objects/WinOutline'
import locales from '../objects/locales'

export default class Main extends Phaser.State {
  init(param) {
    this.lastBall = param.lastBall
  }

  create() {
    this.segments = 20
    this.radius = 150
    this.pinRadius = 4
    this.zoomDuration = 800
    this.rotationTime = 8.5
    this.radian = 360 / this.segments * Math.PI / 180
    this.hitPinName = ''
    this.damping = [0.5, 0.4, 0.3]
    this.finalPart = false
    this.throughPointNum = 1
    this.isCheckStart = false

    this.locales = locales(this.game.opt.lang)

    // p2 world
    this.game.physics.startSystem(Phaser.Physics.P2JS)

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
    this.lightLayer.start()

    const bambooLayer = this.game.add.group()
    bambooLayer.create(0, 0, 'bg_bamboo')

    const wheelfortuneLayer = this.game.add.group()
    const bg_wheelfortune_darkred = new Phaser.Sprite(
      this.game,
      0,
      0,
      'bg_wheelfortune_darkred'
    )
    bg_wheelfortune_darkred.scale.setTo(0.5)
    wheelfortuneLayer.add(bg_wheelfortune_darkred)

    this.draw()

    const pandaLayer = this.game.add.group()
    const pandaImg = new Phaser.Sprite(this.game, 375, 230, 'axis')
    pandaImg.scale.setTo(0.5)
    pandaImg.anchor.setTo(0.5)
    pandaImg.pivot.set(1, -7)
    pandaLayer.add(pandaImg)

    this.distributionLayer = new Distribution(this.game, {
      peach: 0,
      purple: 0
    })

    const cameraPoint = this.game.add.sprite(
      this.wheel.world.x,
      this.wheel.world.y - 200,
      createCircle(this.game, 'cameraPoint', 1, 'rgba(0, 0, 0, 0)')
    )
    this.game.camera.follow(cameraPoint)

    this.roundTimer = this.game.time.create(false)
    this.tickTimer = this.game.time.create(false)

    this.sound = {}
    for (let i = 0; i < 4; i++) {
      this.sound[`throughPoint${i + 1}`] = this.game.add.audio(
        `throughPoint${i + 1}`
      )
    }
    this.sound.hitPoint = this.game.add.audio('hitPoint')

    this.sound.run = this.game.add.audio('run')
    this.sound.win = this.game.add.audio('win')
    this.sound.ready = this.game.add.audio('ready')
    this.sound.bgm = this.game.add.audio('bgm')
    this.sound.bgm.play('', 0, 1, true)

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
      this.distributionLayer.visible = false
      note.visible = false
    }
  }

  update() {
    if (!this.game.info.gameStart && isObject(this.game.result)) {
      // gameStart
      this.game.info.gameStart = true
      this.distributionLayer.closeAll()
      this.spin()

      this.lastBall = this.game.result.num
    }

    // win
    if (
      this.game.info.wheelSpinning &&
      this.wheel.body.angularVelocity < 0.01 &&
      Math.abs(this.arrow.body.rotation) < 0.01
    ) {
      this.game.info.wheelSpinning = false
      this.game.info.wheelStopped = true
      this.game.physics.p2.setImpactEvents(false)

      this.win()
        .then(() => {
          this.zoom('out')
        })
        .then(() => {
          this.lightLayer.start()

          setTimeout(() => {
            this.sound.bgm.resume()
            this.distributionLayer.updateAll({
              peach: 0,
              purple: 0
            })
          }, 3000)
        })
    }

    if (this.game.info.wheelSpinning) {
      this.lightLayer.angle -= 0.1
    }

    this.wheelSprite.angle = this.wheel.body.angle + 100
    this.arrowSprite.angle = this.arrow.body.angle
  }

  shutdown() {
    this.game.world.scale.setTo(1)
    this.end()
  }

  win() {
    this.lightLayer.win()
    this.sound.win.play()

    this.frameAry[this.game.result.num].playWin()
    this.isCheckStart = false

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
  }

  rotation(lastResults) {
    return -((parseInt(lastResults, 10) - 18) * this.radian + this.radian / 2)
  }

  draw() {
    this.wheelSprite = this.game.add.sprite(
      375,
      230,
      'wheelfortune_object_normal'
    )
    this.wheelSprite.scale.setTo(0.5)
    this.wheelSprite.anchor.setTo(0.5)

    this.wheel = this.game.add.sprite(
      375,
      230,
      createWheel(this.game, this.radius, this.radian, this.segments)
    )
    this.wheel.anchor.setTo(0.5)
    this.game.physics.p2.enable(this.wheel)
    this.wheel.body.clearShapes()
    this.wheel.body.rotation = this.rotation(this.lastBall)

    this.wheelAxis = this.game.add.sprite(
      this.wheel.x,
      this.wheel.y,
      createAxis(this.game, 'wheelAxis')
    )
    this.wheelAxis.anchor.setTo(0.5)
    this.game.physics.p2.enable(this.wheelAxis, true)
    this.wheelAxis.body.static = true

    const wheelLockAxis = this.game.physics.p2.createLockConstraint(
      this.wheel,
      this.wheelAxis,
      [0, 0],
      0
    )
    this.game.physics.p2.addConstraint(wheelLockAxis)

    this.frameAry = []

    // pins
    for (let i = 0; i < this.segments; i++) {
      const x = (angle = 0, gap = 0) =>
        Math.cos(this.radian * i + angle) * (this.radius - gap)
      const y = (angle = 0, gap = 0) =>
        Math.sin(this.radian * i + angle) * (this.radius - gap)
      this.wheel.body.addShape(
        new p2.Circle({ radius: this.pinRadius / 20 }),
        x(0, this.pinRadius + 4),
        y(0, this.pinRadius + 4)
      ).name = `pin ${i}`

      this.frameAry.push(
        this.wheel.addChild(
          new WinOutline(this.game, x(this.radian / 2), y(this.radian / 2))
        )
      )
      this.frameAry[i].anchor.setTo(1, 0.5)
      this.frameAry[i].angle = i * (360 / this.segments) + 7.5
    }

    // arrow
    this.arrow = this.game.add.sprite(
      this.wheel.world.x,
      19,
      createArrow(this.game, 'arrow')
    )
    this.game.physics.p2.enable(this.arrow)
    this.arrow.body.mass = 0.1
    this.arrow.body.clearShapes()
    this.arrow.body.addPolygon({}, -6, 0, 6, 0, 0, 20, -6, 0)

    this.arrowSprite = this.game.add.sprite(this.wheel.world.x, 14, 'pointer')
    this.arrowSprite.scale.setTo(0.5)
    this.arrowSprite.anchor.setTo(0.5)
    this.arrowSprite.pivot.y = -22

    // arrowAxis
    this.arrowAxis = this.game.add.sprite(
      this.game.world.centerX,
      16,
      createAxis(this.game, 'arrowAxis')
    )
    this.arrowAxis.anchor.setTo(0.5)
    this.game.physics.p2.enable(this.arrowAxis)
    this.arrowAxis.body.static = true
    this.arrowAxis.body.clearCollision()
    this.game.physics.p2.createRevoluteConstraint(
      this.arrow,
      [0, -10],
      this.arrowAxis,
      [0, 0]
    )

    // arrow rebound
    const springSpriteLeft = this.game.add.sprite(
      this.arrow.x - 15,
      this.arrow.y + 25,
      createCircle(this.game, 'springSpriteLeft', 5, 'rgba(0, 0, 0, 0)')
    )
    const springSpriteRight = this.game.add.sprite(
      this.arrow.x + 15,
      this.arrow.y + 25,
      createCircle(this.game, 'springSpriteRight', 5, 'rgba(0, 0, 0, 0)')
    )
    springSpriteLeft.anchor.setTo(0.5)
    springSpriteRight.anchor.setTo(0.5)
    this.game.physics.p2.enable([springSpriteLeft, springSpriteRight])
    springSpriteLeft.body.static = true
    springSpriteRight.body.static = true
    springSpriteLeft.body.clearCollision()
    springSpriteRight.body.clearCollision()
    this.game.physics.p2.createSpring(springSpriteLeft, this.arrow, 0, 32, 4)
    this.game.physics.p2.createSpring(springSpriteRight, this.arrow, 0, 32, 4)
  }

  carry(num) {
    if (num < 0) return this.segments + num
    return num
  }

  spin() {
    this.lightLayer.run()
    this.sound.bgm.pause()
    this.sound.ready.play()
    this.sound.run.play()

    const arr = []
    const a = this.carry(this.lastBall - 4)
    const b = a
    arr.push(a)

    for (let i = 1; i < 4; i++) arr.push(this.carry(b - i))

    const c = indexOf(arr, this.game.result.num)
    if (c >= 0) this.rotationTime -= (c + 1) * 1.2

    this.game.physics.p2.setImpactEvents(true)
    this.arrow.body.createBodyCallback(this.wheel, this.arrowHitPin, this)

    this.roundTimer.add(
      Phaser.Timer.SECOND * this.rotationTime,
      this.checkPins,
      this
    )
    this.roundTimer.start()
    this.wheel.body.static = true
    this.wheel.body.angularVelocity = 0.5

    this.game.info.wheelSpinning = true
    this.game.info.wheelStopped = false
  }

  checkPins() {
    this.isCheckStart = true
    this.finalPart = false
  }

  arrowHitPin(a, b, c, d) {
    if (this.hitPinName !== d.name) {
      this.hitPinName = d.name
      this.sound.hitPoint.play()

      if (!this.isCheckStart) return

      if (
        getNum(d.name) === segmentCarry(this.game.result.num + 5, this.segments)
      )
        this.finalPart = true
      if (this.finalPart) {
        if (this.throughPointNum === 5) this.throughPointNum = 1
        if (this.sound.run.isPlaying) this.sound.run.fadeOut()
        this.sound[`throughPoint${this.throughPointNum}`].play()
        this.throughPointNum++
      }

      if (
        getNum(d.name) === segmentCarry(this.game.result.num + 6, this.segments)
      )
        this.zoom('in')
      if (
        getNum(d.name) === segmentCarry(this.game.result.num + 3, this.segments)
      ) {
        this.wheel.body.static = false
        this.wheel.body.mass = 9.5
        this.wheel.body.angularDamping = this.damping[this.game.result.type]
      }
    }
  }

  zoom(type) {
    return new Promise((resolve) => {
      this.startTime = Date.now()
      this.tickTimer.loop(
        16,
        () => {
          const currentTime = Date.now()
          const remaining = Math.max(
            0,
            this.zoomDuration + this.startTime - currentTime
          )
          const percent = 1 - remaining / this.zoomDuration

          if (percent === 1) {
            this.tickTimer.destroy()
            resolve()
            if (type === 'out') this.end()
          }

          const scale = Phaser.Easing.Exponential.Out(percent)
          this.game.world.scale.setTo(type === 'in' ? 1 + scale : 2 - scale)
        },
        this
      )
      this.tickTimer.start()
    })
  }

  end() {
    this.game.info.wheelSpinning = false
    this.game.info.gameStart = false
    this.rotationTime = 8.5
    this.game.clearData()
    this.game.animationEnd()
  }
}
