import Phaser from "phaser";
import Card from '../helpers/card';
import Zone from '../helpers/zone';

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  preload() {
    this.load.image('blueBase', 'src/assets/Blue/Base.png');
    /*this.load.image('blueBaseW', 'src/assets/Blue/BaseW.png');
    this.load.image('blueDisc', 'src/assets/Blue/Disc.png');
    this.load.image('blueFlower', 'src/assets/Blue/Flower.png');
    this.load.image('blueSkull', 'src/assets/Blue/Skull.png');

    this.load.image('greenBase', 'src/assets/Green/Base.png');
    this.load.image('greenBaseW', 'src/assets/Green/BaseW.png');
    this.load.image('greenDisc', 'src/assets/Green/Disc.png');
    this.load.image('greenFlower', 'src/assets/Green/Flower.png');
    this.load.image('greenSkull', 'src/assets/Green/Skull.png');

    this.load.image('pinkBase', 'src/assets/Pink/Base.png');
    this.load.image('pinkBaseW', 'src/assets/Pink/BaseW.png');
    this.load.image('pinkDisc', 'src/assets/Pink/Disc.png');
    this.load.image('pinkFlower', 'src/assets/Pink/Flower.png');
    this.load.image('pinkSkull', 'src/assets/Pink/Skull.png');

    this.load.image('purpleBase', 'src/assets/Purple/Base.png');
    this.load.image('purpleBaseW', 'src/assets/Purple/BaseW.png');
    this.load.image('purpleDisc', 'src/assets/Purple/Disc.png');
    this.load.image('purpleFlower', 'src/assets/Purple/Flower.png');
    this.load.image('purpleSkull', 'src/assets/Purple/Skull.png');
      
    this.load.image('redBase', 'src/assets/Red/Base.png');
    this.load.image('redBaseW', 'src/assets/Red/BaseW.png');
    this.load.image('redDisc', 'src/assets/Red/Disc.png');
    this.load.image('redFlower', 'src/assets/Red/Flower.png');
    this.load.image('redSkull', 'src/assets/Red/Skull.png');
      
    this.load.image('yellowBase', 'src/assets/Yellow/Base.png');
    this.load.image('yellowBaseW', 'src/assets/Yellow/BaseW.png');
    this.load.image('yellowDisc', 'src/assets/Yellow/Disc.png');
    this.load.image('yellowFlower', 'src/assets/Yellow/Flower.png');
    this.load.image('yellowSkull', 'src/assets/Yellow/Skull.png');
      
    this.load.image("backdrop", 'src/assets/backdrop.png'); */
  }

  create() {
    let self = this;

    this.dealText = this.add.text(75, 350, ['DEAL CARDS']).setFontSize(18).setFontFamily('Calibri').setColor('#00ffff').setInteractive();

    this.zone = new Zone(this);
    this.dropZone = this.zone.renderZone();
    this.outline = this.zone.renderOutline(this.dropZone);

    //will need to be done for each color
    //actually probably get rid of the button and just spawn them
    this.dealCards = () => {
      for (let i = 0; i < 4; i++) {
        let playerCard = new Card(this);
        playerCard.render(475 + (i * 100), 650, 'blueBase');
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
      //gameObject.setTint(0xff69b4);
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
