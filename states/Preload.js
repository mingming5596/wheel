import PreloadState from '../../PreloadState'

export default class Preload extends PreloadState {
  preload() {
    // ...
  }
  exit() {
    this.state.start('Drawing')
  }
}
