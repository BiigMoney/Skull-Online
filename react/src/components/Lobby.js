import React from "react";
import axios from "axios"
import background from "../assets/table.JPG"
import $ from "jquery"
import "../../extra.css"

export default class Lobby extends React.Component {

    state = {
        isLoading: true,
        name: null,
        players: null,
        lobbies: null,
        allLobbies: null,
        lobbyError: null,
        passwordError: null,
        lobbyLoading: false,
        scene: 0,
        search: "",
        lobbyID: null
    }

    componentDidMount() {
        const localname = localStorage.getItem('name')
        if(!localname || localname.length === 0){
            this.props.history.push('/')
        }
        this.setState({
            name: localname
        })
        axios.get("http://192.168.0.12:8000/lobby").then(res => {
            this.setState({
                lobbies: res.data.games,
                allLobbies: res.data.games,
                players: res.data.users,
                isLoading: false
            })
        })
    }

    selectTable = (id) => {
        this.setState({lobbyID: id})
        $(`#${id}`).addClass('tableSelect').siblings().removeClass('tableSelect')
        document.getElementById("joinButton").disabled = false
        $("#joinButton").on('click', this.joinlobby)
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
        if(this.state.lobbyLoading){
            return
        }
        this.setState({
            lobbyError: null,
            passwordError: null
        })
        e.preventDefault()
        let lobbyName = document.getElementById("lobbyName").value
        let hasPassword = document.getElementById("theCheck").checked
        let password = hasPassword ? document.getElementById("lobbyPassword").value : ''
        let request = {
            socketId: this.props.socket.id,
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

        axios.post("http://192.168.0.12:8000/createLobby", request).then(res => {
            if(res?.data?.success){
                this.props.history.push({
                    pathname: "/play",
                    state: {
                        isAuthed: true,
                        player: res.data.player
                    }
                })
            } else {
                this.setState({lobbyError: "Unknown error", lobbyLoading: false})
            }
        }).catch(err => {
            console.error(err)
            err?.response?.data?.error ? this.setState({lobbyError: err, lobbyLoading: false}) : this.setState({lobbyError: "Unknown error2", lobbyLoading: false})
        })
    }

    joinLobbyPassword = () => {
        let room = this.state.lobbies.find(room => room.roomid === this.state.lobbyID)
        let password = document.getElementById("passwordInput").value
        if(this.isEmpty(password)){
            console.log("empty")
            return
        }
        if(password.length > 20){
            console.log("over 20")
            return
        }
        if(password != room.password){
            console.log(password, room.password)
            console.log("doesnt match")
            return
        }
        let request = {
            socketId: this.props.socket.id,
            password,
            name: this.state.name,
            room: this.state.lobbyID 
        }
        axios.post('http://192.168.0.12:8000/joinLobby', request).then(res => {
            if(res?.data?.success){
                this.props.history.push({
                    pathname: "/play",
                    state: {
                        isAuthed: true,
                        player: res.data.player
                    }
                })
            } else {
                console.log("unknown error")

            }
        }).catch(err => {
            console.error(err)
        })
    }

    joinlobby = () => {
        console.log(this.state.lobbyID)
        let room = this.state.lobbies.find(room => room.roomid === this.state.lobbyID)

        if(room.hasPassword){
            $("#hiddenModalButton").trigger("click")
        } else {
            let request = {
                socketId: this.props.socket.id,
                password: "",
                name: this.state.name,
                room: this.state.lobbyID 
            }
            axios.post('http://192.168.0.12:8000/joinLobby', request).then(res => {
                if(res?.data?.success){
                    this.props.history.push({
                        pathname: "/play",
                        state: {
                            isAuthed: true,
                            player: res.data.player
                        }
                    })
                } else {
                    console.log("unknown error")

                }
            }).catch(err => {
                console.error(err)
            })
        }

    }

    backbutton = () => {
       localStorage.removeItem('name')
       this.props.history.push("/") 
    }

    refreshLobby = () => {
        axios.get("http://192.168.0.12:8000/lobby").then(res => {
            this.setState({
                lobbies: res.data.games,
                allLobbies: res.data.games.filter(a => a.name.includes(this.state.search)),
                players: res.data.users,
                isLoading: false
            })
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
                        <div style={{backgroundColor: "#00000060", position: "absolute", top: "50%", left: "50%", marginTop: "-110px", marginLeft: "-250px", width: 500, height: 220, border: "3px solid #000"}}>
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
                                <h5 style={{display: "inline-block", textAlign: "right", marginRight: 10}} >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Password:</h5>
                                <input type="text" disabled className="form-control-md" size="35" id="lobbyPassword"/>
                            </div>
                            <button type="submit" className="btn btn-outline-primary">Create Lobby</button>
                            </form>
                            {this.state.lobbyError ? <p>{this.state.lobbyError}</p> : null}
                            {this.state.passwordError ? <p>{this.state.passwordError}</p> : null}
                        </div>
                    ) : (
                        <div>
                            {this.state.lobbies.length === 0 ? <p>There are no active lobbies</p> : (
                                <div>
                                <div style={{backgroundColor: "#00000060", position: "absolute", top: "45%", left: "50%", marginTop: "-275px", marginLeft: "-30%", width: "60%", height: "550px", border: "3px solid #000"}}>
                                    <div className="container">
                                    <label htmlFor="lobbySearch">Lobby Browser</label>
                                    <input type="text" className="form-control-md" autoComplete="false" onChange={this.changeSearch}/>
                                    <button type="button" style={{float: "right"}} onClick={this.refreshLobby}>R</button>
                                    </div>
                                    <div class="table-responsive">
                    <table class="table table-fixed">
                        <thead>
                            <tr>
                                <th scope="col" class="col-3">Name</th>
                                <th scope="col" class="col-3">Host</th>
                                <th scope="col" class="col-3">Players</th>
                                <th scope="col" class="col-3">Password?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.lobbies.map((lobby, idx) => {
                                return (
                                    <tr key={idx} onClick={() => this.selectTable(lobby.roomid)} id={lobby.roomid}>
                                        <th scope="row" className="col-3">{lobby.name}</th>
                                        <th className="col-3">{lobby.host}</th>
                                        <th className="col-3">{lobby.players.length}</th>
                                        <th className="col-3">{lobby.hasPassword ? "Yes" : "No"}</th>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                                    <button id="joinButton" style={{justifySelf: "center"}} type="button" className="btn btn-outline-primary" disabled >Join</button>
                            </div>
                            </div>
                            )}
                        </div>
                    )}
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter" hidden="hidden" id="hiddenModalButton">lol</button>

<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Password</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
          <input type="text" className="form-control" id="passwordInput"/>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onClick={this.joinLobbyPassword}>Join</button>
      </div>
    </div>
  </div>
</div>
                </div>
            ) : <div><p>Loading...</p></div>}
            </div>
		);
	}
}
