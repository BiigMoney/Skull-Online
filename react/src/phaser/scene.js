import Phaser from "phaser"
import Card from "./helpers/card"
import info from "./info.json"
import Base from "./helpers/base"
import Button from "./helpers/button"

class playGame extends Phaser.Scene {
  constructor() {
    super({
      key: "game"
    })
  }

  preload() {
    var progressBar = this.add.graphics()
    var progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(700 - 160, 787 / 2, 320, 50)
    this.load.on("progress", value => {
      progressBar.clear()
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(710 - 160, 10 + 787 / 2, 300 * value, 30)
    })

    this.load.image("blueBase", require("../assets/Blue/Base.png").default)
    this.load.image("blueBaseW", require("../assets/Blue/BaseW.png").default)
    this.load.image("blueDisc", require("../assets/Blue/Disc.png").default)
    this.load.image("blueFlower", require("../assets/Blue/Flower.png").default)
    this.load.image("blueSkull", require("../assets/Blue/Skull.png").default)

    this.load.image("greenBase", require("../assets/Green/Base.png").default)
    this.load.image("greenBaseW", require("../assets/Green/BaseW.png").default)
    this.load.image("greenDisc", require("../assets/Green/Disc.png").default)
    this.load.image("greenFlower", require("../assets/Green/Flower.png").default)
    this.load.image("greenSkull", require("../assets/Green/Skull.png").default)

    this.load.image("pinkBase", require("../assets/Pink/Base.png").default)
    this.load.image("pinkBaseW", require("../assets/Pink/BaseW.png").default)
    this.load.image("pinkDisc", require("../assets/Pink/Disc.png").default)
    this.load.image("pinkFlower", require("../assets/Pink/Flower.png").default)
    this.load.image("pinkSkull", require("../assets/Pink/Skull.png").default)

    this.load.image("purpleBase", require("../assets/Purple/Base.png").default)
    this.load.image("purpleBaseW", require("../assets/Purple/BaseW.png").default)
    this.load.image("purpleDisc", require("../assets/Purple/Disc.png").default)
    this.load.image("purpleFlower", require("../assets/Purple/Flower.png").default)
    this.load.image("purpleSkull", require("../assets/Purple/Skull.png").default)

    this.load.image("redBase", require("../assets/Red/Base.png").default)
    this.load.image("redBaseW", require("../assets/Red/BaseW.png").default)
    this.load.image("redDisc", require("../assets/Red/Disc.png").default)
    this.load.image("redFlower", require("../assets/Red/Flower.png").default)
    this.load.image("redSkull", require("../assets/Red/Skull.png").default)

    this.load.image("yellowBase", require("../assets/Yellow/Base.png").default)
    this.load.image("yellowBaseW", require("../assets/Yellow/BaseW.png").default)
    this.load.image("yellowDisc", require("../assets/Yellow/Disc.png").default)
    this.load.image("yellowFlower", require("../assets/Yellow/Flower.png").default)
    this.load.image("yellowSkull", require("../assets/Yellow/Skull.png").default)
    this.load.image("chat", require("../assets/chat2.ico").default)
    this.load.image("backdrop", require("../assets/962592.jpg").default)
  }

  createBases = bases => {
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 3; x++) {
        let xy = x + 3 * y
        bases[xy] = new Base(this)
          .render(info.base.x[x], info.base.y[y], info.colors[xy] + "Base")
          .setName(info.colors[xy])
          .on(
            "pointerdown",
            function () {
              this.scene.socket.emit("selectbase", this.scene.me, this.name)
              this.scene.selectBase(this.scene.me, this.name)
            },
            this.bases[xy]
          )
      }
    }
  }

  createPlayerText = () => {
    this.playerText = [null, null, null, null, null, null]
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 3; x++) {
        let xy = x + 3 * y
        this.playerText[xy] = this.add.text(info.base.x[x], info.base.y[y], "").setOrigin(0.5)
        this.playerText[xy].visible = false
      }
    }
  }

  setBasesInteractive = value => {
    this.bases.forEach(base => {
      value ? base.setInteractive() : base.disableInteractive()
    })
  }

  createCards = color => {
    this.cards = []
    for (let i = 0; i < 3; i++) {
      this.cards[i] = new Card(this, color, "Flower", true).render()
    }
    this.cards[3] = new Card(this, color, "Skull", true).render()
    for (let i = 0; i < 4; i++) {
      this.cards[i].num = i
      this.cards[i].setInteractive({draggable: false})
      this.input.setDraggable(this.cards[i])
      this.cards[i].on(
        "pointerover",
        function () {
          if (!this.isDown) {
            this.y = info.cards.y - 50
            this.scene.children.bringToTop(this)
          }
        },
        this.cards[i]
      )
      this.cards[i].on(
        "pointerout",
        function () {
          if (!this.isDown) {
            this.y = info.cards.y
            this.scene.children.bringToTop(this)
          }
        },
        this.cards[i]
      )
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
      obj.hide()
    })
    this.players.forEach(player => (player ? (player.isFolded = false) : null))
    this.foldText.hide()
    this.bases.forEach(base => {
      if (base.visible) {
        let num = info.colors.indexOf(base.name)
        let x = num >= 3 ? num - 3 : num
        let y = Math.floor(num / 3)
        base.x = info.base.x[x]
        base.y = info.base.y[y]
      }
    })
    if (this.cards) {
      for (let i = 0; i < 4; i++) {
        if (!this.cards[i].isDisabled) {
          this.cards[i].x = info.cards.x[i]
          this.cards[i].y = info.cards.y
          this.cards[i].setInteractive()
          this.cards[i].visible = true
        }
      }
    }
    for (let i = 0; i < this.faceDownCards.length; i++) {
      this.faceDownCards[i].destroy()
    }
    this.faceDownCards = []
  }

  resetCard = card => {
    card.x = info.cards.x[card.num]
    card.y = info.cards.y
  }

  selectBase = (user, color) => {
    user.folded = false
    user.hasLost = false
    user.isPlaying = true
    this.players[info.colors.indexOf(color)] = user
    let num = info.colors.indexOf(color)
    let x = num >= 3 ? num - 3 : num
    let y = Math.floor(num / 3)
    this.bases[num].visible = false
    this.bases[num].disableInteractive()
    this.playerText[x + 3 * y].setText(user.name)

    this.playerText[x + 3 * y].setColor(info.hexColors[x + 3 * y])

    this.playerText[x + 3 * y].visible = true

    if (user.id === this.me.id) {
      this.me.isPlaying = true
      this.me.isFolded = false
      this.me.hasLost = false
      this.color = color
      this.zone = this.add.zone(info.base.x[x], info.base.y[y], 0, 0).setCircleDropZone(info.base.r)
      this.zone.disableInteractive()
      this.setBasesInteractive(false)
      this.text.setText("You are playing as " + color)
    }
    if (this.getNumberOfPlayers(this.players) >= 2 && this.me.host && this.me.isPlaying) {
      this.startGameText.display()
    }
  }

  getNumberOfPlayers = players => {
    let count = 0
    players.forEach(player => {
      if (player) count++
    })
    return count
  }

  getNumberOfActivePlayers = () => {
    let count = 0
    this.players.forEach(player => {
      if (player && !player.hasLost) {
        count++
      }
    })
    return count
  }

  setTurn = color => {
    let num = info.colors.indexOf(color)
    let x = num >= 3 ? num - 3 : num
    let y = Math.floor(num / 3)
    this.outline.clear()
    this.outline.lineStyle(8, info.heXColors[num]).strokeRect(info.base.x[x] - 149 / 2, info.base.y[y] - 148 / 2, 149, 148)
    this.turn = color
    if (this.turn === this.color) {
      if (this.faceDownCards.filter(a => a.obj.color === this.color).length > 0) {
        this.biddingOBJs.forEach(obj => {
          obj.display()
        })
      }
      this.bidding ? this.foldText.display() : this.zone.setInteractive()
      if (this.bidding && this.bidder === color) {
        this.text.setText(this.players[info.colors.indexOf(color)].name + " has to flip " + this.highestBid + " to win the turn.").visible = true
        this.flipping = true
        this.faceDownCards.forEach(card => card.setInteractive())
        this.biddingOBJs.forEach(obj => {
          obj.hide()
        })
        this.foldText.hide()
      }
    } else {
      if (this.bidding && this.bidder === color) {
        this.text.setText(this.players[info.colors.indexOf(color)].name + " has to flip " + this.highestBid + " to win the turn.").visible = true
        this.flipping = true
      }
      this.biddingOBJs.forEach(obj => {
        obj.hide()
      })
      this.foldText.hide()
      if (this.zone) this.zone.disableInteractive()
    }
  }

  fold = color => {
    let num = info.colors.indexOf(color)
    this.players[num].isFolded = true
    let x = num >= 3 ? num - 3 : num
    let y = Math.floor(num / 3)
    this.bases[num].x = info.base.fold.x[x]
    this.bases[num].y = info.base.fold.y[y]
    this.faceDownCards.forEach(card => {
      if (card.obj.color === color) {
        card.x = info.base.fold.x[x]
        card.y = info.base.fold.y[y]
      }
    })
    if (this.color === this.turn) {
      this.foldText.hide()
    }
    this.setNextTurn(color)
  }

  onlyLeft = current => {
    for (var i = 0; i < 6; i++) {
      if (i !== current) {
        if (this.players[i]?.isPlaying && !this.players[i].hasLost) {
          return false
        }
      }
    }
    return true
  }

  setNextTurn = current => {
    let currentNum = info.colors.indexOf(current)
    let counter = 0
    while (true) {
      counter++
      if (counter > 10) {
        this.text.setText("Game over").visible = true
        this.turn = null
        if (this.color === info.colors[currentNum]) {
          this.resetButton.display()
        }
        break
      }
      currentNum === 5 ? (currentNum = 0) : (currentNum += 1)
      if (this.players[currentNum]?.isPlaying) {
        if (this.players[currentNum].hasLost) {
          continue
        }
        if (this.bidding && this.players[currentNum].isFolded) {
          continue
        }
        if (this.onlyLeft(currentNum)) {
          this.outline.clear()
          this.text.setText(`${this.players[currentNum].name} wins!`).visible = true
          if (this.color === info.colors[currentNum]) {
            this.resetButton.display()
          }
          this.turn = ""
        } else {
          this.setTurn(info.colors[currentNum])
        }
        break
      }
    }
  }

  setToRemove = card => {
    for (let i = 0; i < 4; i++) {
      if (!this.cards[i].isDisabled && this.cards[i].obj.type === card.obj.type) {
        this.cards[i].isDisabled = true
        this.cards[i].visible = false
        this.cards[i].disableInteractive()
        break
      }
    }
    this.socket.emit("chooseremove", card.obj.color, this.me.room)
    this.chooseRemove(card.obj.color)
  }

  chooseRemove = color => {
    this.playerText[info.colors.indexOf(color)].setText(`${parseInt(this.playerText[info.colors.indexOf(color)].text) - 1}`)
    this.resetCards()
    this.setTurn(color)
  }

  pickDisks = () => {
    this.pickCards = []
    this.cards.forEach(card => {
      card.isDisabled
        ? this.pickCards.push(null)
        : this.pickCards.push(
            new Card(this, this.color, card.obj.type, true)
              .render()
              .setInteractive()
              .on("pointerdown", function () {
                this.scene.setToRemove(this)
                this.scene.pickCards.forEach(card => (card ? card.destroy() : null))
              })
          )
    })
    for (let i = 0; i < 4; i++) {
      if (this.pickCards[i]) {
        this.pickCards[i].x = info.cards.x[i]
        this.pickCards[i].y = info.cards.pickY
      }
    }
  }

  getNumberOfDisks = () => {
    let count = 0
    this.cards.forEach(card => (card.isDisabled ? null : count++))
    return count
  }

  selectDownDisk = color => {
    let disk = null
    for (let i = this.faceDownCards.length - 1; i >= 0; i--) {
      if (this.faceDownCards[i].obj.color === color && !this.faceDownCards[i].obj.flipped) {
        disk = this.faceDownCards[i]
        break
      }
    }
    disk.x += info.flips[this.faceDownCards.filter(disk => disk.obj.flipped && disk.obj.color === color).length]
    disk.obj.flip()
    info.colors.indexOf(color) < 3 ? (disk.y += 100) : (disk.y -= 100)
    disk.disableInteractive()
    this.children.bringToTop(disk)
    this.flipped++
    if (disk.obj.flipped && disk.obj.type === "Skull") {
      this.faceDownCards.forEach(card => card.disableInteractive())
      if (this.turn === this.color) {
        if (this.getNumberOfDisks() === 1) {
          this.bases[info.colors.indexOf(this.color)].disableInteractive()
          this.zone.disableInteractive()
          this.cards.forEach(card => (card.isDisabled ? null : (card.isDisabled = true)))
          this.socket.emit("playerlost", this.color, this.me.room)
          this.playerLost(this.color)
        } else {
          this.text.setText("")
          this.pickDisks()
        }
      } else {
        this.text.setText(this.players[info.colors.indexOf(this.turn)].name + " is choosing a card to get rid of.").visible = true
      }
    } else {
      if (this.flipped === this.highestBid) {
        if (!this.bases[info.colors.indexOf(this.turn)].obj.flipped) {
          this.bases[info.colors.indexOf(this.turn)].obj.flip()
          this.resetCards()
          this.setTurn(this.turn)
        } else {
          this.text.setText(`${this.turn} wins!`).visible = true
          if (this.turn === this.color) {
            this.resetButton.display()
          }
          this.turn = ""
        }
      }
    }
  }

  startGame = first => {
    this.bases.forEach(base => {
      base.visible = !base.visible
    })
    for (let i = 0; i < 6; i++) {
      if (this.players[i]?.isPlaying) {
        this.playerText[i].setColor("0x000000").setText("4").y += i < 3 ? -85 : 85
        this.playerText[i].visible = true
      }
    }
    this.text.visible = false
    if (this.startGameText) this.startGameText.hide()
    if (this.color) {
      this.createCards(this.color)
      this.resetCards(this.color)
    }
    this.setNextTurn(info.colors[this.players.indexOf(this.players.filter(player => player !== null)[first])])
  }

  playCard = gameObject => {
    //create card at correct position of correct type and set next turn
    let newCard = new Card(this, gameObject.color, gameObject.type, false).render()
    newCard.on(
      "pointerdown",
      function () {
        if (this.scene.faceDownCards.filter(a => a.obj.color === this.scene.color && !a.obj.flipped).length !== 0 && this.obj.color !== this.scene.color) {
          //error sound or text or something
        } else {
          this.scene.socket.emit("flipcard", this.obj.color, this.scene.me.room)
          this.scene.selectDownDisk(this.obj.color)
        }
      },
      newCard
    )
    let num = info.colors.indexOf(gameObject.color)
    let x = num >= 3 ? num - 3 : num
    let y = Math.floor(num / 3)
    newCard.x = info.base.x[x] + info.downs[this.faceDownCards.filter(card => card.obj.color === gameObject.color).length]
    newCard.y = info.base.y[y]
    this.faceDownCards.push(newCard)
    this.setNextTurn(this.turn)
  }

  bid = (color, bid) => {
    //set current bid to bid, set bidder to color and set next turn
    this.highestBid = bid
    this.bidder = color
    this.text.setText("Current bid is " + bid + " by " + color).visible = true
    if (!this.bidding) {
      this.bidding = true
      if (this.cards) this.cards.forEach(card => card.disableInteractive())
    }
    if (this.faceDownCards.length === this.highestBid) {
      for (let i = 0; i < this.players.length; i++) {
        if (i === info.colors.indexOf(color)) {
          continue
        }
        if (this.players[i]?.isPlaying) {
          this.fold(info.colors[i])
        }
      }
    } else {
      this.currentBid = bid + 1
      this.bidNum.text.setText(bid + 1)
    }
    this.setNextTurn(color)
  }

  playerLost = color => {
    this.bases[info.colors.indexOf(color)].visible = false
    this.players[info.colors.indexOf(color)].hasLost = true
    this.resetCards()
    this.setNextTurn(color)
  }

  playerLeave = id => {
    let idx = this.players.indexOf(this.players.find(a => a?.id === id))
    if (idx < 0) {
      console.error("Received player leave but player was not found in the lobby.")
      return
    }
    this.addUnread()
    this.wall.append(this.createMessage("-- ", `${this.players[idx].name} has left the game. : --`, "#888888"))
    let color = info.colors[idx]
    this.playerText[idx].setText("")
    this.players[idx] = null
    if (this.turn) {
      this.bases[idx].visible = false
      this.faceDownCards.forEach(card => (card.obj.color === color ? card.destroy() : null))
      for (let i = 0; i < 6; i++) {
        if (this.onlyLeft(i)) {
          this.biddingOBJs.forEach(obj => obj.hide())
          this.foldText.hide()
          this.outline.clear()
          this.text.setText(`${this.players[i].name} wins!`).visible = true
          if (this.color === info.colors[i]) {
            this.resetButton.display()
          }
          this.turn = ""
          return
        }
      }
      if (this.turn === color) {
        this.setNextTurn(color)
      }
    } else {
      this.bases[idx].visible = true
      if (!this.me.isPlaying) {
        this.bases[idx].setInteractive()
      }
      if (this.getNumberOfPlayers(this.players) === 1) {
        this.startGameText.hide()
      }
    }
  }

  setUpSocket = socket => {
    socket.off("userjoined")
    socket.off("message")
    socket.off("userplaying")
    socket.off("initgame")
    socket.off("startgame")
    socket.off("resetgame")
    socket.off("playcard")
    socket.off("fold")
    socket.off("bid")
    socket.off("flipcard")
    socket.off("chooseremove")
    socket.off("playerlost")
    socket.off("leavegame")
    socket.on("userjoined", user => {
      //add player to lobby ?
      this.addUnread()
      this.wall.append(this.createMessage("-- ", `${user.name} has joined the game! : --`, "#888888"))
    })
    socket.on("message", (name, message, color) => {
      this.addUnread()
      this.wall.append(this.createMessage(name, message, color))
    })
    socket.on("userplaying", this.selectBase)
    socket.on("initgame", (game, user) => {
      //set up players, makes objects visible, loop through events
      game.events.forEach(event => {
        this.functionMap[event.name](...event.args)
      })
    })
    socket.on("startgame", this.startGame)
    socket.on("resetgame", this.resetGame)
    socket.on("playcard", this.playCard)
    socket.on("fold", this.fold)
    socket.on("bid", this.bid)
    socket.on("flipcard", this.selectDownDisk)
    socket.on("chooseremove", this.chooseRemove)
    socket.on("playerlost", this.playerLost)
    socket.on("leavegame", this.playerLeave)
  }

  resetGame = () => {
    this.outline.clear()
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 3; x++) {
        let xy = x + 3 * y
        this.bases[xy].x = info.base.x[x]
        this.bases[xy].y = info.base.y[y]
        if (this.bases[xy].obj.flipped) this.bases[xy].obj.flip()
        this.color ? (this.bases[xy].disableInteractive().visible = true) : (this.bases[xy].setInteractive().visible = true)
        if (this.players[xy]?.isPlaying) this.playerText[xy].setColor(info.hexColors[xy]).setText(this.players[xy].name).y += y === 0 ? 85 : -85
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
      if (player) {
        player.hasLost = false
        player.isFolded = false
      }
    })
    this.resetButton.hide()
    this.text.setText("").visible = false
    this.color ? this.text.setText("Waiting for game to start") : this.text.setText("Select a color by clicking on a mat.")
    if (this.getNumberOfPlayers(this.players) >= 2 && this.me.host && this.me.isPlaying) {
      this.startGameText.display()
    }
    let color = this.color
    this.color = null
    this.players = [null, null, null, null, null, null]
    this.socket.emit("selectbase", this.me, color)
    this.selectBase(this.me, color)
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
    let div = document.createElement("div")
    div.innerHTML = `<p style="color: #888888;"><span style="color: ${color};">${name}</span>: ${text}</p>`
    return div
  }

  clearUnread = () => {
    if (this.unreadMessages > 0 && this.unreadMessages < 99) {
      this.unreadMessages = 0
      this.unreadText.visible = false
      this.unreadGraphics.visible = false
    }
  }

  addUnread = () => {
    if (!this.chatWindow.displayed) {
      if (this.unreadMessages === 0) {
        this.unreadGraphics.visible = true
        this.unreadText.visible = true
      }
      this.unreadMessages += 1
      this.unreadText.setText(`${this.unreadMessages}`)
    }
  }

  create(data) {
    this.me = {...data, id: data.socket.id, socket: null}
    this.unreadMessages = 0
    this.socket = data.socket
    this.setUpSocket(this.socket)
    this.socket.emit("join")
    this.players = [null, null, null, null, null, null]
    this.turn = null
    this.bidding = false
    this.flipping = false
    this.flipped = 0
    this.biddingOBJs = []

    let background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, "backdrop")
    let scaleX = this.cameras.main.width / background.width
    let scaleY = this.cameras.main.height / background.height
    let scale = Math.max(scaleX, scaleY)
    background.setScale(scale).setScrollFactor(0)

    this.createPlayerText()

    this.leaveGame = new Button(this).render(1275, 725, 150, 50, "Leave", function () {
      this.scene.socket.emit("leavegame", this.scene.me)
    })

    this.bidUp = new Button(this).render(1300, 400, 20, 20, "+", function () {
      if (this.scene.faceDownCards.length > this.scene.currentBid) this.scene.bidNum.text.setText(++this.scene.currentBid)
    })
    this.bidUp.hide()
    this.bidNum = new Button(this).render(1250, 400, 40, 40, "1", () => {})
    this.bidNum.hide()
    this.bidDown = new Button(this).render(1200, 400, 20, 20, "-", function () {
      if (this.scene.currentBid > 1 && this.scene.currentBid > this.scene.highestBid + 1) this.scene.bidNum.text.setText(--this.scene.currentBid)
    })
    this.bidDown.hide()
    this.bidSubmit = new Button(this).render(1250, 450, 100, 40, "Submit", function () {
      this.scene.socket.emit("bid", this.scene.color, this.scene.currentBid, this.scene.me.room)
      this.scene.bid(this.scene.color, this.scene.currentBid)
    })
    this.bidSubmit.hide()

    this.startGameText = new Button(this).render(975, 600, 150, 50, "Start Game", function () {
      this.scene.socket.emit("initgame", this.scene.me.room)
      this.scene.startGameText.hide()
    })
    this.startGameText.hide()

    this.foldText = new Button(this).render(1250, 350, 100, 40, "Fold", function () {
      this.scene.socket.emit("fold", this.scene.color, this.scene.me.room)
      this.scene.fold(this.scene.color)
    })
    this.foldText.hide()

    this.biddingOBJs.push(this.bidUp)
    this.biddingOBJs.push(this.bidNum)
    this.biddingOBJs.push(this.bidDown)
    this.biddingOBJs.push(this.bidSubmit)

    this.resetButton = new Button(this).render(975, 600, 150, 50, "Reset Game", function () {
      this.scene.socket.emit("resetgame", this.scene.me.room)
      this.scene.resetButton.hide()
    })
    this.resetButton.hide()

    this.bases = []
    this.faceDownCards = []

    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 3; x++) {
        let xy = x + 3 * y
        this.bases[xy] = new Base(this)
          .render(info.base.x[x], info.base.y[y], info.colors[xy] + "Base")
          .setName(info.colors[xy])
          .on(
            "pointerdown",
            function () {
              this.scene.socket.emit("selectbase", this.scene.me, this.name)
              this.scene.selectBase(this.scene.me, this.name)
            },
            this.bases[xy]
          )
      }
    }
    this.setBasesInteractive(true)
    this.text = this.add.text(this.game.config.width / 2, this.game.config.height / 2, "Select a color by clicking on a mat.").setOrigin(0.5)
    this.text.depth = 10000

    this.input.on("drag", function (pointer, gameObject, x, y) {
      gameObject.x = x
      gameObject.y = y
    })

    this.input.on(
      "dragstart",
      function (pointer, gameObject) {
        this.children.bringToTop(gameObject)
      },
      this
    )

    this.input.on("dragend", function (pointer, gameObject, dropped) {
      if (!dropped) {
        gameObject.scene.resetCard(gameObject)
        gameObject.isDown = false
      } else {
        gameObject.isDown = true
        gameObject.disableInteractive()
        gameObject.visible = false
        gameObject.scene.socket.emit("playcard", gameObject.scene.me.room, gameObject.obj)
        gameObject.scene.playCard(gameObject.obj)
      }
    })

    this.wall = document.createElement("div")
    this.wall.style = "background-color: #31313CDD; width: 250px; height: 645px; overflow-y: auto; padding: 10px; overflow-wrap: break-word;"

    this.chat = document.createElement("input")
    this.chat.style = "padding: 10px; font-size: 20px; width: 250px;"
    this.chat.setAttribute("type", "text")
    this.chat.setAttribute("id", "chat")
    this.chat.setAttribute("placeholder", "Chat Message")
    this.chat.setAttribute("autocomplete", "off")

    this.chatWindow = {
      chat: this.add.dom(1075, 665, this.chat).setOrigin(0, 0),
      wall: this.add.dom(1075, 20, this.wall).setOrigin(0, 0),
      displayed: true
    }
    this.wall.appendChild(this.createMessage("-- ", "Welcome to the game! : --", "#888888"))

    this.hideChat()

    this.outline = this.add.graphics()

    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    this.enterKey.on("down", e => {
      let chat = document.getElementById("chat")
      if (chat.value.trim() !== "") {
        let message = this.createMessage(this.me.name, chat.value, this.color ? this.color : "white")
        this.wall.append(message)
        this.socket.emit("message", this.me.name, chat.value, this.color ? this.color : "white")
        chat.value = ""
      }
    })

    this.chatButton = new Button(this).render(1360, 40, 40, 40, "", () => {
      if (this.chatWindow.displayed) {
        this.hideChat()
      } else {
        this.clearUnread()
        this.displayChat()
      }
    })
    this.add.image(1360, 40, "chat").setOrigin(0.5, 0.5)
    this.unreadGraphics = this.add.circle(1380, 20, 10, 0xff0000).setOrigin(0.5, 0.5)
    this.unreadText = this.add.text(1380, 20, "0").setOrigin(0.5, 0.5)
    this.unreadText.visible = false
    this.unreadGraphics.visible = false
  }

  functionMap = {
    selectbase: this.selectBase,
    startgame: this.startGame,
    playcard: this.playCard,
    bid: this.bid,
    fold: this.fold,
    flipcard: this.selectDownDisk,
    chooseremove: this.chooseRemove,
    playerlost: this.playerLost,
    leavegame: this.playerLeave
  }
}

export default playGame
