import Phaser from "phaser";
import Card from '../helpers/card';
import Zone from '../helpers/zone';

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
    let self = this;

    this.dealText = this.add.text(75, 350, ['DEAL CARDS']).setFontSize(18).setFontFamily('Calibri').setColor('#00ffff').setInteractive();

    this.zone = new Zone(this);
    this.dropZone = this.zone.renderZone();
    this.outline = this.zone.renderOutline(this.dropZone);

    //will need to be done for each color
    this.dealCards = () => {
      for (let i = 0; i < 4; i++) {
        let playerCard = new Card(this);
        playerCard.render(475 + (i * 100), 650, 'redCardback');
      }
    }

    this.dealText.on('pointerdown', function () {
      self.dealCards();
    })

    this.dealText.on('pointerover', function () {
      self.dealText.setColor('#ff69b4');
    })

    this.dealText.on('pointerout', function () {
      self.dealText.setColor('#00ffff');
    })

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    })

    this.input.on('dragstart', function (pointer, gameObject) {
      gameObject.setTint(0xff69b4);
      self.children.bringToTop(gameObject);
    })

    this.input.on('dragend', function (pointer, gameObject, dropped) {
      gameObject.setTint();
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    })

    this.input.on('drop', function (pointer, gameObject, dropZone) {
      dropZone.data.values.cards++;
      gameObject.x = (dropZone.x - 25) + (dropZone.data.values.cards * 10);
      gameObject.y = dropZone.y;
      gameObject.disableInteractive();
    })

  }//create

}//playGame

export default playGame;
