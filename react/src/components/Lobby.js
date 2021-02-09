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

    getthedata = () => {
        const localname = localStorage.getItem('name')
        if(localname === null || localname.length === 0){
            this.props.history.push({
                pathname: `/`
            })
        }
        this.setState({
            name: localname,
            isLoading: true
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

    componentDidMount() {
        this.setState({
            scene: 0
        })
        this.getthedata()
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
            players: []
        }
        axios.post("http://localhost:5000/skull-online-313fe/us-central1/api/room", lobby).then( res =>{
            let roomid = res.data.room.id
            axios.post("http://localhost:5000/skull-online-313fe/us-central1/api/player", {name: this.state.name, room: roomid}).then( res =>{
                let theplayer = {
                    player: {player: res.data.player.id, room: roomid, name: this.state.name, host: true}
                }
                axios.put(`http://localhost:5000/skull-online-313fe/us-central1/api/addplayertoroom/${roomid}`, theplayer).then(() => {
                    this.props.history.push({
                        pathname: `/play`,
                        state: {isAuthed: true, player: theplayer}
                    })
                })
            })
        })
    }

    joinlobby = (e) => {
        e.preventDefault()
        const roomid = e.target.id
        axios.get(`http://localhost:5000/skull-online-313fe/us-central1/api/room/${roomid}`).then(res => {
            console.log(res.data)
            if(res.data.hasPassword){
                const trypassword = document.getElementById(`${roomid}input`).value
                if(!(trypassword === res.data.password)){
                    console.log(trypassword)
                    console.log(res.data.password)
                    this.setState({
                        errors: "Incorrect password"
                    })
                    console.log("returning")
                    return
                }
            }
            axios.post("http://localhost:5000/skull-online-313fe/us-central1/api/player", {name: this.state.name, room: roomid}).then( res =>{
                let theplayer = {
                    player: {player: res.data.player.id, room: roomid, name: this.state.name, host: false}
                }
                axios.put(`http://localhost:5000/skull-online-313fe/us-central1/api/addplayertoroom/${roomid}`, theplayer).then(() => {
                    this.props.history.push({
                        pathname: `/play`,
                        state: {isAuthed: true, player: theplayer}
                    })
                })
            })
        })

    }

    backbutton = () => {
        this.setState({
            scene: 0
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
                    <button onClick={this.getthedata}>Refresh</button>
                    
                    {this.state.scene === 0 ? (
                        <div>
                            <button disabled>Back</button>
                        <div>
                            <button onClick={() => this.setState({scene: 1})}>Create Lobby</button>
                            <button onClick={() => this.setState({scene: 2})}>Join Lobby</button>
                        </div>
                        </div>
                    ) : this.state.scene === 1 ? (
                        <div>
                        <button onClick={this.backbutton}>Back</button>
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
                        </div>
                    ) : (
                        <div>
                        <button onClick={this.backbutton}>Back</button>
                        <div>
                            {this.state.lobbies.length === 0 ? <p>There are no active lobbies</p> : (
                                <div>
                            {this.state.lobbies.map(lobby => {
                                return(
                                    <div style={{display: "inline"}}>
                                        <p>{lobby.name}</p>
                                        {lobby.hasPassword ? (
                                            <div>
                                                <form onSubmit={this.joinlobby}>
                                                <p>Password:</p>
                                                <input autoComplete="off" type="text" id="joinlobbypassword" id={lobby.id + "input"}/>
                                                <button onClick={this.joinlobby} id={lobby.id}>Join</button>
                                                </form>
                                            </div>
                                        ) : (
                                            <div>
                                                <button onClick={this.joinlobby} id={lobby.id}>Join</button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                            </div>
                            )}
                        </div>
                        </div>
                    )}
                </div>
            ) : <div><p>Loading...</p></div>}
            </div>
		);
	}
}
