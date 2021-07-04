import React from "react";
import Phaser from "phaser";
import playGame from "../phaser/scene";
import socketio from 'socket.io-client'
import { Redirect } from 'react-router-dom'

export default class Skull extends React.Component {

    state = {
      game: null,
      socket: null,
      redirect: null
    }

	  componentDidMount = () => {
      const config = {
        type: Phaser.AUTO,
        parent: "phaser",
        width: 1400,
        height: 800,
        scene: playGame
        };
      const game = new Phaser.Game(config);
      this.setState({
        game: game,
        socket: this.props.socket
      })
      this.props.socket.on("error", () => {
        window.location.reload()
      })
      const player = this.props.player
      let bruno = {
        player: player.player,
        room: player.room,
        socket: this.props.socket,
        host: player.host,
        name: player.name
      }
      game.scene.start("game", bruno)
    }

    componentWillUnmount(){
      this.state.game ? this.state.game.destroy(true, true) : null
      this.state.socket ? this.state.socket.disconnect() : null
      window.location.reload()
    }
    render() {
            return (
                <div>
                  {this.state.redirect ? <Redirect to='/'/>:null}
                </div>
            );
        }
}