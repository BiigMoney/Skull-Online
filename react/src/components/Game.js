import React from "react";
import Skull from "./Skull"

export default class Game extends React.Component {

    state = {
        isAuthed: false,
        player: null
    }

    componentDidMount(){
        console.log("made it to game")


        const { state } = this.props.location;
        if (state && state.isAuthed) {
            this.setState({
                isAuthed: true,
                player: state.player
            })
            this.props.history.replace({
                state: {}
            })
            return
        }

        this.props.history.push("/lobby")

    }
	render() {
		return (
			<div style={{ textAlign: "center" }}>
			{this.state.isAuthed ? (
                <div>
                    <h1>User is authed</h1>
                    <Skull player={this.state.player}/>
                </div>
                ) : <h1>User is not authed</h1>}
			</div>
		);
	}
}
