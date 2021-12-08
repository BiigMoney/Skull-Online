export default class Button {
  constructor(scene) {
    this.render = (x, y, w, l, text, onClick) => {
      this.x = x
      this.y = y
      this.w = w
      this.l = l
      this.text = scene.add.text(x, y, text).setOrigin(0.5, 0.5)
      this.zone = scene.add.zone(x, y, w, l).setOrigin(0.5, 0.5).setInteractive().on("pointerdown", onClick)
      this.graphics = scene.add
        .graphics()
        .lineStyle(4, 0x000000)
        .strokeRect(x - 0.5 * w, y - 0.5 * l, w, l)
      return this
    }

    this.display = () => {
      this.text.visible = true
      this.zone.setInteractive().visible = true
      this.graphics.lineStyle(4, 0x000000).strokeRect(this.x - 0.5 * this.w, this.y - 0.5 * this.l, this.w, this.l)
    }

    this.hide = () => {
      this.text.visible = false
      this.zone.disableInteractive().visible = false
      this.graphics.clear()
    }
  }
}
