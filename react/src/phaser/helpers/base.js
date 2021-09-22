export default class Base {
  constructor(scene) {
    this.flipped = false
    this.render = (x, y, sprite) => {
      let base = scene.add.image(x, y, !this.flipped ? sprite : sprite + "W").setScale(0.3, 0.3)
      this.sprite = sprite
      this.base = base
      base.obj = this
      return base
    }

    this.flip = () => {
      this.flipped = !this.flipped
      this.base.setTexture(!this.flipped ? this.sprite : this.sprite + "W")
    }
  }
}
