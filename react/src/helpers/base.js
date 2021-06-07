export default class Base {
    constructor(scene) {
        this.flipped = false
        this.render = (x, y, sprite) => {
            let fsprite = !this.flipped ? sprite : sprite+"W"
            let base = scene.add.image(x, y, fsprite).setScale(0.3, 0.3);
            this.sprite = sprite
            this.base = base
            base.obj = this
            return base;
        }

        this.flip = () => {
            this.flipped = !this.flipped
            let fsprite = !this.flipped ? this.sprite : this.sprite+"W"
            this.base.setTexture(fsprite)
        }
    }
}