import {Fragment, Component} from "react"
import Phaser from "phaser"
import playGame from "../phaser/scene"
import {connect} from "react-redux"
import {setLobbyError, reloadData} from "../redux/actions"

class Skull extends Component {
  state = {
    game: null,
    socket: null
  }

  leaveGame = () => {
    this.state?.game?.destroy(true, false)
    this.props.history.replace("/lobby")
  }

  componentDidMount = () => {
    const config = {
      type: Phaser.AUTO,
      dom: {
        createContainer: true
      },
      scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.FIT,
        parent: "phaser-example",
        width: 1400,
        height: 787
      },
      scene: new playGame()
    }
    const game = new Phaser.Game(config)
    this.setState({
      game: game,
      socket: this.props.store.socket
    })
    this.props.store.socket.on("error", error => {
      this.state.game.destroy(true, false)
      this.props.setLobbyError(error)
      console.log("error happened", error)
      this.props.reloadData()
      this.props.history.replace("/lobby")
    })
    this.props.store.socket.on("leave", this.leaveGame)
    const player = this.props.player
    let cfg = {
      room: player.room,
      socket: this.props.store.socket,
      host: player.host,
      name: player.name
    }
    game.scene.start("game", cfg)
  }

  componentWillUnmount() {
    this.state?.game?.destroy(true, false)
    this.props.store.socket.emit("leavegame")
    this.props.reloadData()
  }

  render() {
    return <Fragment />
  }
}

const mapStateToProps = state => ({
  store: state
})

const mapActionsToProps = {
  setLobbyError,
  reloadData
}
export default connect(mapStateToProps, mapActionsToProps)(Skull)
