import Phaser from "phaser";
import Card from '../helpers/card';

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  preload() {
    this.load.image('redCardback', 'src/assets/cards/redCardback.png');
    /*this.load.image("redFlower", src/assets/cards/redFlower.png);
    this.load.image("redSkull", src/assets/cards/redSkull.png);
    this.load.image("redCoaster0", src/assets/cards/redCoaster0.png);
    this.load.image("redCoaster1", src/assets/cards/redCoaster1.png);
    
    this.load.image('blueCardback', 'src/assets/cards/redCardback.png');
    this.load.image("blueFlower", src/assets/cards/redFlower.png);
    this.load.image("blueSkull", src/assets/cards/redSkull.png);
    this.load.image("blueCoaster0", src/assets/cards/redCoaster0.png);
    this.load.image("blueCoaster1", src/assets/cards/redCoaster1.png);
    
    this.load.image('greenCardback', 'src/assets/cards/redCardback.png');
    this.load.image("greenFlower", src/assets/cards/redFlower.png);
    this.load.image("greenSkull", src/assets/cards/redSkull.png);
    this.load.image("greenCoaster0", src/assets/cards/redCoaster0.png);
    this.load.image("greenCoaster1", src/assets/cards/redCoaster1.png);

    this.load.image('pinkCardback', 'src/assets/cards/redCardback.png');
    this.load.image("pinkFlower", src/assets/cards/redFlower.png);
    this.load.image("pinkSkull", src/assets/cards/redSkull.png);
    this.load.image("pinkCoaster0", src/assets/cards/redCoaster0.png);
    this.load.image("pinkCoaster1", src/assets/cards/redCoaster1.png);
    
    this.load.image('purpleCardback', 'src/assets/cards/redCardback.png');
    this.load.image("purpleFlower", src/assets/cards/redFlower.png);
    this.load.image("purpleSkull", src/assets/cards/redSkull.png);
    this.load.image("purpleCoaster0", src/assets/cards/redCoaster0.png);
    this.load.image("purpleCoaster1", src/assets/cards/redCoaster1.png);
    
    this.load.image('yellowCardback', 'src/assets/cards/redCardback.png');
    this.load.image("yellowFlower", src/assets/cards/redFlower.png);
    this.load.image("yellowSkull", src/assets/cards/redSkull.png);
    this.load.image("yellowCoaster0", src/assets/cards/redCoaster0.png);
    this.load.image("yellowCoaster1", src/assets/cards/redCoaster1.png);
    
    this.load.image("backdrop", src/assets/cards/backdrop.png); */
  }
  create() {
    this.Card = this.add.image(300,300, 'redCardback').setScale(0.2, 0.2).setInteractive();
    this.input.setDraggable(this.Card);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY){
      gameObject.x = dragX;
      gameObject.y = dragY;
    })

  }
}

export default playGame;
