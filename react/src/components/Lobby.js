import React from "react";
import axios from "axios"
import $ from "jquery"
import background from "../assets/table.jpg"
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
        joinPasswordError: null,
        joinError: null,
        fatalError: null,
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
        axios.get("/lobby").then(res => {
            this.setState({
                lobbies: res.data.games,
                allLobbies: res.data.games,
                players: res.data.users,
                isLoading: false
            })
        }).catch(err => {
            console.error(err)
            this.setState({fatalError: "Could not connect to server, please try again later."})
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

    filterLobbies = () => {
        if(this.state.lobbyID){
            $(`#${this.state.lobbyID}`).removeClass('tableSelect').siblings().removeClass('tableSelect')
        }
        let filter = document.getElementById("lobbySearch").value
        this.setState({
            lobbies: this.state.allLobbies.filter(lobby => lobby.name.toLowerCase().includes(filter.toLowerCase()) || lobby.host.toLowerCase().includes(filter.toLowerCase()))
        })
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

        axios.post("/createLobby", request).then(res => {
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

    refreshErrors = () => {
        this.setState({
            lobbyError: null,
            passwordError: null,
            joinPasswordError: null,
            joinError: null,
            fatalError: null,
            lobbyLoading: false
        })
    }

    joinLobbyPassword = () => {
        this.refreshErrors()
        let room = this.state.lobbies.find(room => room.roomid === this.state.lobbyID)
        let password = document.getElementById("passwordInput").value
        if(this.isEmpty(password)){
            this.setState({joinPasswordError: "Password cannot be empty."})
            return
        }
        if(password.length > 20){
            this.setState({joinPasswordError: "Password cannot be longer than 20 characters."}) 
            return
        }
        if(password != room.password){
            this.setState({joinPasswordError: "Incorrect password."})
            return
        }
        let request = {
            socketId: this.props.socket.id,
            password,
            name: this.state.name,
            room: this.state.lobbyID 
        }
        axios.post('/joinLobby', request).then(res => {
            if(res?.data?.success){
            $("#closeModal").trigger("click")
                this.props.history.push({
                    pathname: "/play",
                    state: {
                        isAuthed: true,
                        player: res.data.player
                    }
                })
            } else {
                this.setState({joinPasswordError: "Error joining lobby."})
                console.error("unknown error 1")

            }
        }).catch(err => {
            err?.response?.data?.error ? this.setState({joinError: err.response.data.error}) : this.setState({joinError: "Error joining lobby"})
            console.error(err)
            console.error("unknown error 2")
        })
    }

    joinlobby = () => {
        this.refreshErrors()
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
            axios.post('/joinLobby', request).then(res => {
                if(res?.data?.success){
                    this.props.history.push({
                        pathname: "/play",
                        state: {
                            isAuthed: true,
                            player: res.data.player
                        }
                    })
                } else {
                    this.setState({joinError: "Error joining lobby"})
                    console.error("unknown error 3")

                }
            }).catch(err => {
                console.error(err)
                err?.response?.data?.error ? this.setState({joinError: err.response.data.error}) : this.setState({joinError: "Error joining lobby"})
                console.error("unknown error 4")
            })
        }

    }

    backbutton = () => {
       localStorage.removeItem('name')
       this.props.history.push("/") 
    }

    refreshLobby = () => {
        this.refreshErrors()
        axios.get("/lobby").then(res => {
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
			<div style={{backgroundImage: `url(${background})`, textAlign: "center", width: "100%",  height: "100%", position: "absolute", top: 0, left: 0 }}>
            {!this.state.isLoading ? (
                <div>
                    <div style={{marginTop: 50}}>
                        <button style={{marginLeft:100, marginRight: 100, width:150}} className="btn btn-outline-primary" onClick={() => this.setState({scene:1})}  aria-pressed="false" autoComplete="off">Create Lobby</button>    
                        <button style={{marginLeft:100, marginRight: 100, width: 150}}className="btn btn-outline-primary" onClick={() => this.setState({scene:2})} aria-pressed="false" autoComplete="off">Join Lobby</button>    
                        <button style={{marginLeft:100, marginRight: 100, width: 150}}className="btn btn-outline-primary" onClick={() => this.setState({scene:0})} aria-pressed="false" autoComplete="off">About</button>    
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
                                <input type="text" autoComplete="off" className="form-control-md" size="35" id="lobbyName"/>
                            </div>
                            {this.state.lobbyError ? <p style={{color: "red"}}>{this.state.lobbyError}</p> : <React.Fragment/>}
                            <div style={{display: "block" }}>
                                <h5 style={{display: "inline-block", textAlign: "right", marginRight: 10}} >Password?</h5>
                                <input type="checkbox" className="form-check-input" id="theCheck" onClick={this.checkboxClick}/>
                            </div>
                            <div style={{display: "block" }}>
                                <h5 style={{display: "inline-block", textAlign: "right", marginRight: 10}} >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Password:</h5>
                                <input type="text" autoComplete="off" disabled className="form-control-md" size="35" id="lobbyPassword"/>
                            </div>
                            {this.state.passwordError? <p style={{color: "red"}}>{this.state.passwordError}</p> : <React.Fragment/>}
                            <button type="submit" className="btn btn-outline-primary">Create Lobby</button>
                            </form>
                        </div>
                    ) : (
                        <div>
                            {this.state.allLobbies.length === 0 ? (
                                <React.Fragment>
                            <p style={{marginTop: 20, fontSize: 30}}>There are no active lobbies.</p>
      <button type="button" className="ml-auto btn btn-primary float-xs-right" onClick={this.refreshLobby} ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
  <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
  <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
</svg></button>
                                </React.Fragment>
                            ) : (
                                <div>
                                <div style={{backgroundColor: "#00000060", position: "absolute", top: "50vh", left: "50vw", marginTop: "-30vh", marginLeft: "-30vw", width: "60vw", height: "60vh", border: "3px solid #000"}}>
                                    <div>
                                    <nav class="navbar navbar-expand-xs" style={{background: "none", backgroundColor: "transparent"}}>
  <a class="navbar-brand" style={{paddingLeft: 25}} >Lobby Browser</a>
  <div className="col-xl-8" style={{margin: "auto"}}>
      <input class="form-control mr-sm-2" type="search" placeholder="Filter" aria-label="Search" id="lobbySearch" onChange={this.filterLobbies}/>
  </div>
  <ul  className="navbar-nav ml-auto float-xs-right" style={{marginRight: 20}} >
      <li>
      <button type="button" className="ml-auto btn btn-primary float-xs-right" onClick={this.refreshLobby} ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
  <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
  <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
</svg></button>
      </li>
  </ul>
</nav>
                                    </div>
                                    <div class="table-responsive">
                    <table class="table table-fixed" >
                        <thead className="thead-dark">
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
                                    <tr key={idx}  onClick={() => this.selectTable(lobby.roomid)} id={lobby.roomid}>
                                        <th scope="row" className="col-3 ">{lobby.name}</th>
                                        <th className="col-3">{lobby.host}</th>
                                        <th className="col-3">{lobby.players.length}</th>
                                        <th className="col-3">{lobby.hasPassword ? "Yes" : "No"}</th>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                    <button id="joinButton" style={{position: "absolute", bottom: "8%", margin: "auto"}} type="button" className="btn btn-outline-primary"  disabled >Join</button>
                {this.state.joinError ? <p style={{color: "red"}}>{this.state.joinError}</p> : <React.Fragment/> }
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
      </div>
      <div class="modal-body">
          <input type="text" autoComplete="off" className="form-control" id="passwordInput"/>
      </div>
      <div class="modal-footer">
        {this.state.joinPasswordError ? <p style={{color: "red"}}>{this.state.joinPasswordError}</p> : <React.Fragment/>}
        <button type="button" class="btn btn-secondary" id="closeModal" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onClick={this.joinLobbyPassword}>Join</button>
      </div>
    </div>
  </div>
</div>
                </div>
            ) : (this.state.fatalError ? <div><p>{this.state.fatalError}</p></div> : <div><p>Loading...</p></div>)}
            </div>
		);
	}
}
