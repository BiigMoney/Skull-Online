export default class Card {
  constructor(scene, color, type, flipped) {
    this.flipped = flipped
    this.color = color
    this.type = type
    this.render = () => {
      var scale = this.flipped ? 0.5 : 0.25
      var sprite = this.color + this.flipped ? this.type : "Disc"
      let card = scene.add.image(0, 0, sprite).setScale(scale, scale)
      this.card = card
      card.obj = this
      return card
    }
    this.flip = () => {
      this.flipped = !this.flipped
      this.card.setTexture(this.flipped ? this.color + this.type : this.color + "Disc")
    }
  }
}
