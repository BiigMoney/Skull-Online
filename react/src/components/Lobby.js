import React from "react";
import axios from "axios"
import { projectFirestore } from "../firebase/config"
import background from "../assets/Capture.JPG"

export default class Lobby extends React.Component {

    state = {
        isLoading: true,
        name: null,
        players: null,
        lobbies: null,
        lobbyError: null,
        passwordError: null,
        lobbyLoading: false,
        scene: 0
    }

    componentDidMount() {
        const localname = localStorage.getItem('name')
        const {socket} = this.props
        if(!localname || localname.length === 0){
            this.props.history.push('/')
        }
        this.setState({
            name: localname
        })
        axios.get("/lobby").then(res => {
            this.setState({
                lobbies: res.data.games,
                players: res.data.users,
                isLoading: false
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
    
    isEmpty(string){
        return (!string || 0 === string.length);
    }

    submitLobby = (e) => {
        this.setState({
            lobbyError: null,
            passwordError: null
        })
        e.preventDefault()
        let lobbyName = document.getElementById("lobbyName").value
        let hasPassword = document.getElementById("theCheck").value 
        let password = document.getElementById("lobbyPassword").value 
        let request = {
            username: this.state.name,
            name: lobbyName,
            hasPassword,
            password
        }

        if(this.isEmpty(lobbyName)){
            this.setState({
                lobbyError: "Lobby name cannot be empty."
            })
            return
        }

        if(lobbyName.length > 20){
            this.setState({
                lobbyError: "Lobby name cannot be longer than 20 characters"
            })
            return
        }
        
        if(hasPassword && this.isEmpty(password)){
            this.setState({
                passwordError: "Password cannot be empty"
            })
            return
        }

        if(hasPassword && password.length > 20){
            this.setState({
                passwordError: "Password cannot be longer than 20 characters"
            })
            return
        }

        this.setState({lobbyLoading: true})

        axios.post("/createLobby", request).then(res => {
            if(res?.data?.success){
                this.props.history.push({
                    pathname: "/play",
                    state: {
                        isAuthed: true
                    }
                })
            } else {
                this.setState({lobbyError: "Unknown error", lobbyLoading: false})
            }
        }).catch(err => {
            console.error(err)
            err?.response?.data?.error ? this.setState({lobbyError: err, lobbyLoading: false}) : this.setState({lobbyError: "Unknown error2", lobbyLoading: false})
        })

        this.props.history.push({
            pathname: "/play",
            state: {isAuthed: true, player, lobby, host: true}
        })

    }

    joinlobby = (e) => {
        e.preventDefault()
        const roomid = e.target.id
    }

    backbutton = () => {
        this.setState({
            scene: 0
        })
    }

	render() {
		return (
			<div style={{backgroundImage: `url(${background})`, textAlign: "center", width: "100%",  height: "100%", position: "absolute", top: 0, left: 0}}>
            {!this.state.isLoading ? (
                <div>
                    <div style={{marginTop: 50}}>
                        <button style={{marginLeft:100, marginRight: 100}} className="btn btn-outline-primary" onClick={() => this.setState({scene:1})} data-toggle="button" aria-pressed="false" autoComplete="off">Create Lobby</button>    
                        <button style={{marginLeft:100, marginRight: 100}}className="btn btn-outline-primary" onClick={() => this.setState({scene:2})}data-toggle="button" aria-pressed="false" autoComplete="off">Join Lobby</button>    
                        <button style={{marginLeft:100, marginRight: 100}}className="btn btn-outline-primary" onClick={() => this.setState({scene:0})}data-toggle="button" aria-pressed="false" autoComplete="off">About</button>    
                    </div> 
                    {this.state.scene === 0 ? (
                        <div style={{marginTop: 60}}>
                    <h4 style={{marginTop: 15}}>Welcome {this.state.name}</h4>
                    <h4>There are currently {this.state.players} people playing.</h4>
                    </div>
                    ) : this.state.scene === 1 ? (
                        <div style={{position: "absolute", top: "50%", left: "50%", marginTop: "-110px", marginLeft: "-250px", width: 500, height: 220, border: "3px solid #000"}}>
                            <form style={{marginTop: 35}} onSubmit={this.submitLobby}>
                            <div style={{display: "block" }}>
                                <h5 style={{display: "inline-block", textAlign: "right", marginRight: 10}} >Lobby Name:</h5>
                                <input type="text" className="form-control-md" size="35" id="lobbyName"/>
                            </div>
                            <div style={{display: "block" }}>
                                <h5 style={{display: "inline-block", textAlign: "right", marginRight: 10}} >Password?</h5>
                                <input type="checkbox" className="form-check-input" id="theCheck" onClick={this.checkboxClick}/>
                            </div>
                            <div style={{display: "block" }}>
                                <h5 style={{display: "inline-block", textAlign: "right", marginRight: 10}} >Password:</h5>
                                <input type="text" disabled className="form-control-md" size="35" id="lobbyPassword"/>
                            </div>
                            <button type="submit" className="btn btn-outline-primary">Create Lobby</button>
                            </form>
                        </div>
                    ) : (
                        <div>
                            {this.state.lobbies.length === 0 ? <p>There are no active lobbies</p> : (
                                <div>
                            {this.state.lobbies.map((lobby,idx) => {
                                return(
                                    <div style={{display: "inline"}} key={idx}>
                                        <p>{lobby.name}</p>
                                        {lobby.hasPassword ? (
                                            <div>
                                                <form onSubmit={this.joinlobby} id={lobby.id}>
                                                <p>Password:</p>
                                                <input autoComplete="off" type="text" id="joinlobbypassword" id={lobby.id + "input"}/>
                                                <button type="submit" id={lobby.id}>Join</button>
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
                    )}
                </div>
            ) : <div><p>Loading...</p></div>}
            </div>
		);
	}
}
