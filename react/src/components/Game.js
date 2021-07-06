import axios from "axios";
import React from "react";
import socketio from 'socket.io-client'
import Skull from "./Skull"

export default class Game extends React.Component {

    state = {
        isAuthed: false,
        player: null,
        socket: null,
    }

    sendChat = (e) =>{
        e.preventDefault()
        this.setState(prevState => ({
            messages: [...prevState.messages, document.getElementById('chat').value]
        }))
    }

    componentDidMount(){

        const { state } = this.props.location;
        if (state && state.isAuthed) {
            this.setState({isAuthed: true, player: state.player})
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
                    <h1>Skull Online :logo:</h1>
                    <div style={{display: "inline"}}>
                    <Skull player={this.state.player} socket={this.props.socket}/>
                    </div>
                </div>
                ) : <h1>User is not authed</h1>}
			</div>
		);
	}
}
