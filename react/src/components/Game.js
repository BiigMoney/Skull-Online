import axios from "axios";
import React from "react";
import socketio from 'socket.io-client'
import Skull from "./Skull"

export default class Game extends React.Component {

    state = {
        isAuthed: false,
        player: null,
        socket: null,
        messages: ["hi", "this is a test", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"]
    }

    componentDidMount(){
        console.log("made it to game")


        const { state } = this.props.location;
        if (state && state.isAuthed) {
            return
        }

        this.props.history.push("/lobby")

    }
	render() {
        let chat = (
        <div class="row well">
            <div class="col-sm-9">
                <div id="global-chat-container" style={{height: 900, overflowY: "scroll", wordWrap: "break-word"}}>
                    {this.state.messages.map((text, idx) => {
                        return <p>{text}</p>
                    })}
                    
                </div>
            </div>

            <div>
                <form data-bind="submit: sendGlobalMessage">
                    <input placeholder="Global chat message" type="text" class="form-control" data-bind="value: globalMessage, valueUpdate: &quot;afterkeydown&quot;"/>
                </form>
            </div>
        </div>
        )
		return (
			<div style={{ textAlign: "center" }}>
			{this.state.isAuthed ? (
                <div>
                    <h1>User is authed</h1>
                    <div style={{display: "inline"}}>
                    <Skull player={this.state.player} socket={this.state.socket}/>
                    {chat}
                    </div>
                </div>
                ) : <h1>User is not authed</h1>}
			</div>
		);
	}
}
