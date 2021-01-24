import React from "react";
import axios from "axios"

export default class Lobby extends React.Component {

    state = {
        isLoading: true,
        name: null,
        players: null,
        lobbies: null,
        errors: null,
        scene: 0
    }

    componentDidMount() {
        this.setState({
            name: localStorage.getItem('name'),
            scene: 0
        })

        axios.get("http://localhost:5000/skull-online-313fe/us-central1/api/rooms").then( res =>{
            this.setState({
                lobbies: res.data
            })
            if(this.state.players){
                this.setState({
                    isLoading: false
                })
            }
        }).catch(err =>{
            this.setState({
                errors: err
            })
        })

        axios.get("http://localhost:5000/skull-online-313fe/us-central1/api/players").then( res =>{
            this.setState({
                players: res.data
            })
            if(this.state.lobbies){
                this.setState({
                    isLoading: false
                })
            }
        }).catch(err =>{
            this.setState({
                errors: err
            })
        })


    }

    checkboxClick() {
        let checkBox = document.getElementById("theCheck")
        let input = document.getElementById("lobbyPassword")
        if(checkBox.checked){
            input.disabled = false
        } else {
            input.disabled = true
        }
    }

    submitLobby = () => {
        let lobbyName = document.getElementById("lobbyName").value
        let player = {
            name: this.state.name, 
            lobby: lobbyName
        }
        let lobby = {
            name: lobbyName,
            hasPassword: document.getElementById("theCheck").checked,
            password: document.getElementById("lobbyPassword").value,
            players: [player]
        }
        axios.post("http://localhost:5000/skull-online-313fe/us-central1/api/room", lobby).then( res =>{
            console.log(res)
            axios.post("http://localhost:5000/skull-online-313fe/us-central1/api/player", {name: this.state.name, room: res.data.room.id}).then( res =>{
                console.log("the second res: " + res)
                this.props.history.push({
                    pathname: "/play",
                    state: {isAuthed: true}
                })
            })
        })
    }

	render() {
		return (
            <div>
			<div style={{ textAlign: "center" }}>
				<h1>Lobby Time!</h1>
			</div>
            {!this.state.isLoading ? (
                <div>
                    <h4>Welcome {this.state.name}</h4>
                    <h4>There are currently {this.state.players.length} people playing.</h4>
                    {this.state.scene === 0 ? (
                        <div>
                            <button onClick={() => this.setState({scene: 1})}>Create Lobby</button>
                            <button onClick={() => this.setState({scene: 2})}>Join Lobby</button>
                        </div>
                    ) : this.state.scene === 1 ? (
                        <div>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <p>Name:</p>
                                <input autoComplete="off" type="text" id="lobbyName" placeholder="name..."/>
                                <br/>
                                <input type="checkbox" value="" id="theCheck" onClick={this.checkboxClick}/>
                                <label for="defaultCheck2">
                                Password?
                                </label>
                                <p>Password:</p>
                                <input autoComplete="off" type="text" id="lobbyPassword" placeholder="name..." disabled/>
                                <button onClick={this.submitLobby}>Create Lobby</button>
                            </form>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            ) : <div><p>Loading...</p></div>}
            </div>
		);
	}
}
