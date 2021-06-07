export default class Card {
    constructor(scene, color, type, flipped) {
        this.flipped = flipped
        this.color = color
        this.type = type
        this.render = () => {
            if(this.flipped){
                var scale = 0.5
                var sprite = this.color + this.type
            }else{
                var scale = 0.25
                var sprite = this.color + "Disc"
            }
            let card = scene.add.image(0, 0, sprite).setScale(scale, scale);
            this.card = card 
            card.obj = this
            return card;
        }
        this.flip = () => {
            this.flipped = !this.flipped
            if(this.flipped){
                var sprite = this.color + this.type
            }
            else{
                var sprite = this.color + "Disc"
            }
            this.card.setTexture(sprite)
        }
    }
}