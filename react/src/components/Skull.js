import React from "react";
import Phaser from "phaser";
import playGame from "../phaser/scene";
import { Redirect } from 'react-router-dom'
import Handler from "../phaser/handler"

export default class Skull extends React.Component {

    state = {
      game: null,
      socket: null,
      redirect: null
    }

	  componentDidMount = () => {
      const config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            parent: 'phaser-example',
            width: 1920,
            height: 800
        },
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
      console.log(player)
      let bruno = {
        room: player.room,
        socket: this.props.socket,
        host: player.host,
        name: player.name
      }
      game.scene.start("game", bruno)
      game.embedded = false // game is embedded into a html iframe/object
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