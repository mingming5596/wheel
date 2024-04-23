
# Wheel

使用 Phaser 製作輪盤的小程式, 使用物理引擎轉至指定結果


## Tech Stack

**Client:** Phaser2


## Usage/Examples

```javascript
Animate.forge('Wheel', {
  width: 750,
  height: 504,
  parent: document.querySelector('#app'),
  transparent: false,
  options: {
    isMute: true,
    hideDistr: true
  }
}).then((app) => {
  global.app = app;
  
  app.start({
    lastBall: 4
  });

  app.play({
    type: 1,
    num: 8
  })
})

```


## Demo


![screenshot](./demo.gif)


