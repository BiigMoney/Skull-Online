import React from "react";
import Phaser from "phaser";
import playGame from "../phaser/scene";

export default class Skull extends React.Component {

    config = {
		type: Phaser.AUTO,
		parent: "phaser",
		width: 800,
		height: 600,
		scene: playGame
	  };
	  
      game = new Phaser.Game(this.config);
      
    render() {
            return (
                <div>
                </div>
            );
        }
}