import Phaser from "phaser";
import Card from '../helpers/card';
import info from "./info.json"
import Base from '../helpers/base'
import Button from '../helpers/button'

class playGame extends Phaser.Scene {
  constructor() {
    super({
      key: "game"
    });
  }

  preload() {
    this.load.html("chat", "src/helpers/chat.html")
    this.load.image('blueBase', 'src/assets/Blue/Base.png');
    this.load.image('blueBaseW', 'src/assets/Blue/BaseW.png');
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
      
    this.load.image("backdrop", 'src/assets/962592.jpg'); 
  }

  createBases = (bases) => {

    for(let y = 0; y < 2; y++){
      for(let x = 0; x < 3; x++){
        let xy = x + 3*y
        bases[xy] = new Base(this).render(info.base.x[x], info.base.y[y], info.colors[xy] + "Base").setName(info.colors[xy]).on('pointerdown', function () {
          this.scene.socket.emit("selectbase", this.scene.me, this.name)
        }, this.bases[xy])
      }
    }

  }
  
  createPlayerText = () => {
    this.playerText = [null,null,null,null,null,null]
    for(let y = 0; y < 2; y++){
      for(let x = 0; x < 3; x++){
        let xy = x + 3*y
        this.playerText[xy] = this.add.text(info.base.x[x], info.base.y[y], "").setOrigin(0.5)
        this.playerText[xy].visible = false
      }
    }
  }

  setBasesInteractive = (bases, value) => {
    bases.forEach(base => { value ? base.setInteractive() : base.disableInteractive()})
  }

  createCards = (color) => {
    this.cards = []
    for(let i = 0; i < 3; i++){
      this.cards[i] = new Card(this, color, "Flower", true).render()
    }
    this.cards[3] = new Card(this, color, "Skull", true).render()
    for(let i = 0; i < 4; i++){
      this.cards[i].num = i
      this.cards[i].setInteractive({draggable: false})
      this.input.setDraggable(this.cards[i])
      this.cards[i].on('pointerover', function() {
        if(!this.isDown) {
          this.y = info.cards.y-50
          this.scene.children.bringToTop(this)
        }}, this.cards[i])
      this.cards[i].on('pointerout', function() {
        if(!this.isDown){
          this.y = info.cards.y
          this.scene.children.bringToTop(this)
        }}, this.cards[i])
    }
  }

  resetCards = () => {
    this.text.visible = false
    this.highestBid = 0
    this.currentBid = 1
    this.bidding = false
    this.flipping = false
    this.flipped = 0
    this.bidNum.text.setText(1)
    this.biddingOBJs.forEach(obj => {
      console.log(obj)
      obj.hide()
    })
    this.players.forEach(player => player ? player.isFolded = false : null)
    this.foldText.hide()
    this.bases.forEach(base => {
      if(base.visible){
        let num = info.colors.indexOf(base.name)
        let x = num >= 3 ? num-3 : num
        let y = Math.floor(num/3)
        base.x = info.base.x[x]
        base.y = info.base.y[y]
      }
    })
    if(this.cards){
      for(let i = 0; i < 4; i++){
        if(!this.cards[i].isDisabled){
          this.cards[i].x = info.cards.x[i]
          this.cards[i].y = info.cards.y
          this.cards[i].setInteractive()
          this.cards[i].visible = true
          }
        } 
    }
    for(let i = 0; i < this.faceDownCards.length; i++){
      this.faceDownCards[i].destroy()
    }
    this.faceDownCards = []
  }

  resetCard = (card) => {
    card.x = info.cards.x[card.num]
    card.y = info.cards.y
  }

  selectBase = (user, color) => {
    console.log("selecting base")
    user.folded = false 
    user.hasLost = false 
    user.isPlaying = true
    this.players[info.colors.indexOf(color)] = user 
    let num = info.colors.indexOf(color)
    let x = num >= 3 ? num-3 : num
    let y = Math.floor(num/3)
    this.bases[num].visible = false 
    this.bases[num].disableInteractive()
    console.log(user.name)
    this.playerText[x+(3*y)].setText(user.name).setColor(info.hexColors[x+(3*y)]).visible = true
    console.log(this)
    if(user.id === this.me.id){
      this.me.isPlaying = true 
      this.me.isFolded = false 
      this.me.hasLost = false
      this.color = color 
      console.log("1")
      this.zone = this.add.zone(info.base.x[x], info.base.y[y], 0, 0).setCircleDropZone(info.base.r)
      console.log("2")
      this.zone.disableInteractive()
      this.setBasesInteractive(this.bases, false)
      this.text.setText("You are playing as " + color)
    }
    if(this.getNumberOfPlayers(this.players) >= 2 && this.me.host && this.me.isPlaying){
      this.startGameText.display()
    }
    
  }
  
  

  getNumberOfPlayers = (players) => {
    let count = 0
    players.forEach(player => {
      player ? count++ : null
    })
    return count
  }


  setTurn = (color) => {
    let num = info.colors.indexOf(color)
    let x = num >= 3 ? num-3 : num
    let y = Math.floor(num/3)
    this.outline.clear()
    console.log(info.heXColors[num])
    this.outline.lineStyle(8, info.heXColors[num]).strokeRect(info.base.x[x] - 149/2, info.base.y[y] - 148/2, 149, 148)
    this.turn = color
    if(this.turn == this.color){
      if(this.faceDownCards.filter(a => a.obj.color === this.color).length > 0){
        this.biddingOBJs.forEach(obj => {
          obj.display()
        })
      }
      console.log(this.bidding)
      this.bidding ? this.foldText.display() : this.zone.setInteractive()
      if(this.bidding && (this.bidder === color)){
        this.text.setText(color + " has to flip " + this.highestBid + " to win the turn.").visible = true
        console.log("flipping")
        this.flipping = true
        this.faceDownCards.forEach(card => card.setInteractive())
        this.biddingOBJs.forEach(obj => {
          obj.hide()
        })
        this.foldText.hide()
      }
    }
    else{
      if(this.bidding && this.bidder === color){
        this.text.setText(color + " has to flip " + this.highestBid + " to win the turn.").visible = true
        console.log("flipping")
        this.flipping = true
        this.foldText.hide()
      }
      this.biddingOBJs.forEach(obj => {
        obj.hide()
      })
      this.zone ? this.zone.disableInteractive() : null
    }
  }

  fold = (color) => {
    let num = info.colors.indexOf(color)
    this.players[num].isFolded = true
    let x = num >= 3 ? num-3 : num
    let y = Math.floor(num/3)
    this.bases[num].x = info.base.fold.x[x]
    this.bases[num].y = info.base.fold.y[y]
    this.faceDownCards.forEach(card => {
      if(card.obj.color == color){
        card.x = info.base.fold.x[x]
        card.y = info.base.fold.y[y]
      }
    })
    if(this.color === this.turn){
      this.foldText.hide()
    }
    this.setNextTurn(color)
  }

  onlyLeft = (current) => {
    for(var i = 0; i < 6; i++){
      if(!(i == current)){
        if(this.players[i]){
          if(!this.players[i].hasLost){
            return false
          } else {
          }
        }
      }
    }
    return true
  }

  setNextTurn = (current) => {
    let currentNum = info.colors.indexOf(current)
    let counter = 0
    while(true){
      counter++
      if(counter > 10){
        this.add.text(700,400,"Game over")
        this.turn = null 
        break
      }
      currentNum == 5 ? currentNum = 0 : currentNum+=1
      if(this.players[currentNum]){
        if(this.players[currentNum].hasLost){
          continue
        }
        if(this.bidding && this.players[currentNum].isFolded){
          continue
        }
        if(this.onlyLeft(currentNum)){
          this.text.setText(`${info.colors[currentNum]} wins!`).visible = true
          if(this.color === info.colors[currentNum]){ 
            this.resetButton.display()
          }
          this.turn = "" 
        } else {
          console.log(this.players[currentNum])
          this.setTurn(info.colors[currentNum])
        }
        break
      }
    }
  }

  setToRemove = (card) => {
    for(let i = 0; i < 4; i++){
      if(!this.cards[i].isDisabled && this.cards[i].obj.type == card.obj.type){
        this.cards[i].isDisabled = true
        this.cards[i].visible = false
        this.cards[i].disableInteractive()
        break
      }
    }
    this.socket.emit("chooseremove", card.obj.color, this.me.room)
  }

  chooseRemove = (color) => {
    console.log(color + " has removed a card.")
    this.resetCards()
    this.setTurn(color)

  }

  pickDisks = () => {
    this.pickCards = []
    this.cards.forEach(card => {
      card.isDisabled ? this.pickCards.push(null) : this.pickCards.push(new Card(this, this.color, card.obj.type, true).render().setInteractive().on('pointerdown', function () {
        this.scene.setToRemove(this)
        this.scene.pickCards.forEach(card => card ? card.destroy() : null)
      }))
    })
    for(let i = 0; i < 4; i++){
      if(this.pickCards[i]){
        this.pickCards[i].x = info.cards.x[i]
        this.pickCards[i].y = info.cards.pickY
      }
    }
  }

  getNumberOfDisks = () => {
    let count = 0
    this.cards.forEach(card => card.isDisabled ? null : count++)
    return count

  }


  selectDownDisk = (color) => {
    let disk = null
    for(let i = this.faceDownCards.length-1; i >= 0; i--){
      if(this.faceDownCards[i].obj.color === color && !this.faceDownCards[i].obj.flipped){
        disk = this.faceDownCards[i]
        break
      }
    }
    disk.x += info.flips[this.faceDownCards.filter(disk => disk.obj.flipped && disk.obj.color === color).length]
    disk.obj.flip()
    info.colors.indexOf(color) < 3 ? disk.y += 100 : disk.y -= 100
    disk.disableInteractive()
    this.children.bringToTop(disk)
    this.flipped++
    if(disk.obj.flipped && disk.obj.type == "Skull"){
      if(this.turn === this.color){
        if(this.getNumberOfDisks() === 1){
          console.log("should have lost")
          this.bases[info.colors.indexOf(this.color)].disableInteractive()
          this.zone.disableInteractive()
          this.cards.forEach(card => card.isDisabled ? null : card.isDisabled = true)
          this.socket.emit("playerlost", this.color, this.me.room)
        } else {
          this.pickDisks()
        }
      } else {
        this.text.setText(this.turn + " is choosing a card to get rid of.").visible = true
      }
    }else{
      if(this.flipped == this.highestBid){
        if(!this.bases[info.colors.indexOf(this.turn)].obj.flipped){
          this.bases[info.colors.indexOf(this.turn)].obj.flip()
          this.resetCards()
          this.setTurn(this.turn)
        }else{
          this.text.setText(`${this.turn} wins!`).visible = true
          if(this.turn === this.color){
            this.resetButton.display()
          }
          this.turn = "" 
        }
      }
    }
  }

  startGame = (first) => {
    console.log("start game")
    this.bases.forEach(base => {
      base.visible ? base.visible = false : base.visible = true
    })
    this.text.visible = false 
    this.startGameText ? this.startGameText.hide() : null
    console.log("past hide")
    if(this.color){
      this.createCards(this.color)
      this.resetCards(this.color)
    }
    this.setNextTurn(info.colors[first])
  }

  playCard = (gameObject) => {
    //create card at correct position of correct type and set next turn
    let newCard = new Card(this,gameObject.color, gameObject.type, false).render()
    newCard.on('pointerdown', function () {
      if(this.scene.faceDownCards.filter(a => a.obj.color === this.scene.color && !a.obj.flipped).length !== 0 && this.obj.color !== this.scene.color){
        //error sound or text or something
      } else {
        this.scene.socket.emit("flipcard", this.obj.color, this.scene.me.room)
      }
    }, newCard)
    let num = info.colors.indexOf(gameObject.color)
    let x = num >= 3 ? num-3 : num
    let y = Math.floor(num/3)
    newCard.x = info.base.x[x]
    newCard.y = info.base.y[y]
    this.faceDownCards.push(newCard)
    this.setNextTurn(this.turn)
  }

  bid = (color, bid) => {
    //set current bid to bid, set bidder to color and set next turn
    this.highestBid = bid 
    this.bidder = color
    this.text.setText("Current bid is " + bid + " by " + color).visible = true
    if(!this.bidding){
      this.bidding = true 
      this.cards ? this.cards.forEach(card => {card.disableInteractive()}) : null
    }
    if(this.faceDownCards.length === this.highestBid){
      for(let i = 0; i < this.players.length; i++){
        if(i === info.colors.indexOf(color)){
          continue
        }
        if(this.players[i]){
          this.fold(info.colors[i])
        }
      }
    } else {
      this.currentBid = bid+1
      this.bidNum.text.setText(bid+1)
    }
    this.setNextTurn(color)
  }

  playerLost = (color) => {
    this.bases[info.colors.indexOf(color)].visible = false
    this.players[info.colors.indexOf(color)].hasLost = true
    this.text.setText(color + " has lost!").visible = true
    this.resetCards()
    console.log("player lost, setting next turn to " + color)
    this.setNextTurn(color)
  }

  playerLeave = (id) => {
    let idx = this.players.indexOf(this.players.find(a => a?.id === id))
    if(idx < 0){
      return
    }
    let color = info.colors[idx]
    this.playerText[idx].setText('')
    this.players[idx] = null 
    if(this.turn){
      this.bases[idx].visible = false
      if(this.turn === color){
        this.setNextTurn(color)
      }
    } else {
      this.bases[idx].setInteractive().visible = true
      console.log(this.getNumberOfPlayers(this.players))
      if(this.getNumberOfPlayers(this.players) === 1){
        this.startGameText.hide()
      } 
    }
  } 

  setUpSocket = (socket) => {
    let self = this
    socket.on("userjoined", (user) => {
      console.log(user.name + " has joined the room")
      //add player to lobby ?
    })
    socket.on("message", (name, message, color) => {
      console.log("receiving message")
      this.wall.append(this.createMessage(name, message, color))
    })
    socket.on("userplaying", self.selectBase)
    socket.on("initgame", (game, user) => {
      //set up players, makes objects visible, loop through events
      console.log("initgame", game, user)
      self.me = user
      game.events.forEach(event => {
        console.log(event)
        self.functionMap[event.name](...event.args)
      })
    })
    socket.on("startgame", self.startGame)
    socket.on("resetgame", self.resetGame)
    socket.on("playcard", self.playCard)
    socket.on("fold", self.fold)
    socket.on("bid", self.bid)
    socket.on("flipcard", self.selectDownDisk) 
    socket.on("chooseremove", self.chooseRemove)
    socket.on("playerlost", self.playerLost)
    socket.on("leavegame", self.playerLeave)
    socket.on("wingame", (player) => {
      //display text indicating player has won the game, reset game
    })

  }

  resetGame = () => {
    for(let y = 0; y < 2; y++){
      for(let x = 0; x < 3; x++){
        let xy = x + 3*y
        this.bases[xy].x = info.base.x[x]
        this.bases[xy].y = info.base.y[y]
        this.bases[xy].obj.flipped ? this.bases[xy].obj.flip() : null
        this.color ? this.bases[xy].disableInteractive().visible = true : this.bases[xy].setInteractive().visible = true 
      }
    }
    this.cards.forEach(card => card.destroy())
    this.cards = []
    this.faceDownCards.forEach(card => card.destroy())
    this.faceDownCards = []
    this.biddingOBJs.forEach(obj => obj.hide())
    this.turn = null 
    this.bidding = false 
    this.flipping = false 
    this.players.forEach(player => {
      if(player){
        player.hasLost = false 
        player.isFolded = false
      }
    })
    this.resetButton.hide()
    this.text.setText("").visible = false
    this.color ? this.text.setText("Waiting for game to start") : this.text.setText("Select a color by clicking on a mat.")
    if(this.getNumberOfPlayers(this.players) >= 2 && this.me.host && this.me.isPlaying){
      this.startGameText.display()
    }
    let color = this.color 
    this.color = null 
    this.players = [null,null,null,null,null,null]
    this.socket.emit("selectbase", this.me, color)
  }

  displayChat = () => {
    this.chatWindow.chat.visible = true 
    this.chatWindow.wall.visible = true 
    this.chatWindow.displayed = true 
  }
  hideChat = () => {
    this.chatWindow.chat.visible = false
    this.chatWindow.wall.visible = false
    this.chatWindow.displayed = false
  }

  createMessage = (name, text, color) => {
    console.log(color)
    let div = document.createElement("div")
    div.innerHTML = `<p style="color: #888888;"><span style="color: ${color};">${name}</span>: ${text}</p>`
    return div
  }

  create(data) {
    console.log(data)
    this.socket = data.socket 
    this.users = []
    this.setUpSocket(this.socket) 
    this.socket.emit("join")
    this.players = [null,null,null,null,null,null]
    this.turn = null
    this.bidding = false
    this.flipping = false
    this.flipped = 0
    this.biddingOBJs = []

    let background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2,"backdrop")
    let scaleX = this.cameras.main.width / background.width
let scaleY = this.cameras.main.height / background.height
let scale = Math.max(scaleX, scaleY)
background.setScale(scale).setScrollFactor(0)

    this.createPlayerText()

    this.leaveGame = new Button(this).render(1275,725,150,50,"Leave", function() {this.scene.socket.emit("leavegame", this.scene.me)})

    this.bidUp = new Button(this).render(1300,400,40,40,"Add", function() {this.scene.faceDownCards.length > this.scene.currentBid? this.scene.bidNum.text.setText(++this.scene.currentBid) : null})
    this.bidUp.hide()
    this.bidNum = new Button(this).render(1250,400,40,40,"1",() => {})
    this.bidNum.hide()
    this.bidDown = new Button(this).render(1200,400,40,40,"Sub", function () {this.scene.currentBid > 1 && this.scene.currentBid > this.scene.highestBid+1 ? this.scene.bidNum.text.setText(--this.scene.currentBid) : null})
    this.bidDown.hide() 
    this.bidSubmit = new Button(this).render(1250,450,100,40,"Submit", function () {
      this.scene.socket.emit("bid", this.scene.color, this.scene.currentBid, this.scene.me.room)
    })
    this.bidSubmit.hide()

    this.startGameText = new Button(this).render(975,600,150,50,"Start Game", function() {this.scene.socket.emit("initgame", this.scene.me.room)})
    this.startGameText.hide()

    this.foldText = new Button(this).render(1250,350,100,40,"Fold", function () {this.scene.socket.emit("fold", this.scene.color, this.scene.me.room)})
    this.foldText.hide()

    this.biddingOBJs.push(this.bidUp)
    this.biddingOBJs.push(this.bidNum)
    this.biddingOBJs.push(this.bidDown)
    this.biddingOBJs.push(this.bidSubmit)

    this.resetButton = new Button(this).render(975,600,150,50,"Reset Game", function() {this.scene.socket.emit("resetgame", this.scene.me.room)})
    this.resetButton.hide()

    this.bases = []
    this.faceDownCards = []
    //set on game create 
    this.createBases(this.bases)
    this.setBasesInteractive(this.bases,true)
    this.text = this.add.text(this.game.config.width/2,this.game.config.height/2,"Select a color by clicking on a mat.").setOrigin(0.5)

    this.input.on('drag', function (pointer, gameObject, x, y) {
      gameObject.x = x
      gameObject.y = y
    })

    this.input.on('dragstart', function(pointer, gameObject) {
      this.children.bringToTop(gameObject)
    }, this)

    this.input.on('dragend', function(pointer, gameObject, dropped){
      if(!dropped){
        gameObject.scene.resetCard(gameObject)
        gameObject.isDown = false
      }else{
        gameObject.isDown = true
        gameObject.disableInteractive()
        gameObject.visible = false
        gameObject.scene.socket.emit("playcard", gameObject.scene.me.room, gameObject.obj)


      }
    })

    this.wall = document.createElement("div")
    this.wall.style = "background-color: #31313CDD; width: 250px; height: 645px; overflow-y: auto; padding: 10px; overflow-wrap: break-word;"

    this.chatWindow = {
      chat: this.add.dom(1050,655).createFromCache("chat").setOrigin(0,0), 
      wall: this.add.dom(1050,10, this.wall).setOrigin(0,0),
      displayed: true
    }
    this.wall.appendChild(this.createMessage("-- ","Welcome to the game! : --", "#888888"))

    this.hideChat()

    this.outline = this.add.graphics()

    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    this.enterKey.on("down", (e) => {
      let chat = this.chatWindow.chat.getChildByName("chat")
      if(chat.value.trim() != ""){
        let message = this.createMessage(this.me.name, chat.value, this.color ? this.color : "white")
        this.wall.append(message)
        this.socket.emit("message", this.me.name, chat.value, this.color ? this.color : "white")
        chat.value = ""
      }
    })

    this.chatButton = new Button(this).render(1360,40,40,40,"C", () => {this.chatWindow.displayed ? this.hideChat() : this.displayChat()})

  }

  functionMap = {
    "selectbase": this.selectBase,
    "startgame": this.startGame,
    "playcard": this.playCard,
    "bid": this.bid,
    "fold": this.fold,
    "flipcard": this.selectDownDisk,
    "chooseremove": this.chooseRemove,
    "playerlost": this.playerLost,
    "leavegame": this.playerLeave
  }


}



export default playGame;