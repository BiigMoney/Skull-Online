import {Fragment, Component} from "react"
import {Scale, AUTO, Game} from "phaser"
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
      type: AUTO,
      dom: {
        createContainer: true
      },
      scale: {
        autoCenter: Scale.CENTER_BOTH,
        mode: Scale.FIT,
        parent: "phaser-example",
        width: 1400,
        height: 787
      },
      scene: playGame
    }
    const game = new Game(config)
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
    let bruno = {
      room: player.room,
      socket: this.props.store.socket,
      host: player.host,
      name: player.name
    }
    game.scene.start("game", bruno)
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
