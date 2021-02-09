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
        width: 1200,
        height: 800,
        scene: playGame
        };
      const game = new Phaser.Game(config);
      let socket = socketio("http://localhost:8000")
      this.setState({
        game: game,
        socket: socket
      })
      socket.on("dc", () => {
        console.log(this)
        socket.disconnect()
        this.setState({
          redirect: true
        })
      })
      const {player} = this.props.player
      console.log(player)
      socket.emit("join", {player: player.player, room : player.room, name: player.name, host: player.host})
      let bruno = {
        player: player.player,
        room: player.room,
        socket: socket,
        host: player.host,
        name: player.name
      }

      game.scene.start(playGame, bruno)
    }

    componentWillUnmount(){
      this.state.game.destroy(true, true)
      this.state.socket.disconnect()
      window.location.reload()
    }
    config = {
		type: Phaser.AUTO,
		parent: "phaser",
		width: 1400,
		height: 800,
		scene: playGame
	  };
	  
      game = new Phaser.Game(this.config);
    render() {
            return (
                <div>
                  {this.state.redirect ? <Redirect to='/'/>:null}
                </div>
            );
        }
}