import React from "react";
import Phaser from "phaser";
import playGame from "../phaser/scene";
import { Redirect } from 'react-router-dom'
import Handler from "../phaser/handler"
import background from "../assets/962592.jpg"
import $ from 'jquery'

export default class Skull extends React.Component {

    state = {
      game: null,
      socket: null,
      redirect: null
    }

    leaveGame = () => {
      this.state?.game?.destroy(true, true)
      this.props.history.push('/lobby')
    }

	  componentDidMount = () => {
      const config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            parent: 'phaser-example',
            width: 1400,
            height: 787
        },
        scene: playGame 
        };
      const game = new Phaser.Game(config);
      this.setState({
        game: game,
        socket: this.props.socket
      })
      this.props.socket.on("error", (error) => {
        this.state.game.destroy(true, true)
        this.props.history.push({pathname: "/lobby", state: {error: true, code: error}})
      })
      this.props.socket.on("leave",this.leaveGame)
      const player = this.props.player 
      console.log(player)
      let bruno = {
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