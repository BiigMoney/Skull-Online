import {Component, Fragment} from "react"
import axios from "axios"
import $ from "jquery"
import {connect} from "react-redux"
import {setName, setLobbyLoading, reloadData} from "../redux/actions"

class Lobby extends Component {
  state = {
    allLobbies: null,
    lobbyError: null,
    passwordError: null,
    joinPasswordError: null,
    joinError: null,
    scene: 0,
    search: "",
    lobbyID: null
  }

  componentDidMount() {
    const localname = localStorage.getItem("name")
    if (!localname || localname.length === 0) {
      this.props.history.replace("/")
    }
    if (!this.props.store.name) {
      this.props.setName(localname)
    }
    if (this.props.store.lobby.error) {
      $("#hiddenErrorModalButton").trigger("click")
    }
    console.log(this.props.store.socket)
  }

  selectTable = id => {
    this.setState({lobbyID: id})
    $(`#${id}`).addClass("tableSelect").siblings().removeClass("tableSelect")
    document.getElementById("joinButton").disabled = false
    $("#joinButton").on("click", this.joinlobby)
  }

  checkboxClick() {
    let checkBox = document.getElementById("theCheck")
    let input = document.getElementById("lobbyPassword")
    if (checkBox.checked) {
      input.disabled = false
    } else {
      input.disabled = true
    }
  }

  filterLobbies = () => {
    if (this.state.lobbyID) {
      $(`#${this.state.lobbyID}`).removeClass("tableSelect").siblings().removeClass("tableSelect")
    }
  }

  isEmpty(string) {
    return !string || 0 === string.length
  }

  submitLobby = e => {
    if (this.props.store.lobby.loading) {
      return
    }
    this.setState({
      lobbyError: null,
      passwordError: null
    })
    e.preventDefault()
    let lobbyName = document.getElementById("lobbyName").value
    let hasPassword = document.getElementById("theCheck").checked
    let password = hasPassword ? document.getElementById("lobbyPassword").value : ""
    let request = {
      socketId: this.props.store.socket.id,
      username: this.props.store.name,
      name: lobbyName,
      hasPassword,
      password
    }

    if (this.isEmpty(lobbyName)) {
      this.setState({
        lobbyError: "Lobby name cannot be empty."
      })
      return
    }

    if (lobbyName.length > 20) {
      this.setState({
        lobbyError: "Lobby name cannot be longer than 20 characters"
      })
      return
    }

    if (hasPassword && this.isEmpty(password)) {
      this.setState({
        passwordError: "Password cannot be empty"
      })
      return
    }

    if (hasPassword && password.length > 20) {
      this.setState({
        passwordError: "Password cannot be longer than 20 characters"
      })
      return
    }

    this.props.setLobbyLoading(true)

    axios
      .post("/createLobby", request)
      .then(res => {
        if (res?.data?.success) {
          this.props.history.replace({
            pathname: "/play",
            state: {
              isAuthed: true,
              player: res.data.player
            }
          })
        } else {
          this.setState({lobbyError: "Unknown error"})
          this.props.setLobbyLoading(false)
        }
      })
      .catch(err => {
        console.error(err)
        err?.response?.data?.error ? this.setState({lobbyError: err}) : this.setState({lobbyError: "Unknown error2"})
        this.props.setLobbyLoading(false)
      })
  }

  refreshErrors = () => {
    this.setState({
      lobbyError: null,
      passwordError: null,
      joinPasswordError: null,
      joinError: null,
      fatalError: null
    })
  }

  joinLobbyPassword = e => {
    let {lobby, socket, name} = this.props.store
    let {lobbyID} = this.state
    if (lobby.loading) {
      return
    }
    if (e) e.preventDefault()
    this.refreshErrors()
    let room = lobby.games.find(room => room.roomid === lobbyID)
    let password = $("#passwordInput").val().toString()
    if (this.isEmpty(password)) {
      this.setState({joinPasswordError: "Password cannot be empty."})
      return
    }
    if (password.length > 20) {
      this.setState({joinPasswordError: "Password cannot be longer than 20 characters."})
      return
    }
    if (password !== room.password) {
      this.setState({joinPasswordError: "Incorrect password."})
      return
    }
    this.props.setLobbyLoading(true)
    let request = {
      socketId: socket.id,
      password,
      name: name,
      room: lobbyID
    }
    axios
      .post("/joinLobby", request)
      .then(res => {
        if (res?.data?.success) {
          $("#closeModal").trigger("click")
          this.props.history.replace({
            pathname: "/play",
            state: {
              isAuthed: true,
              player: res.data.player
            }
          })
        } else {
          this.setState({joinPasswordError: "Error joining lobby."})
          this.props.setLobbyLoading(false)
          console.error("unknown error 1")
        }
      })
      .catch(err => {
        err?.response?.data?.error ? this.setState({joinError: err.response.data.error}) : this.setState({joinError: "Error joining lobby"})
        this.props.setLobbyLoading(false)
        console.error(err)
        console.error("unknown error 2")
      })
  }

  joinlobby = () => {
    let {lobby, socket, name} = this.props.store
    let {lobbyID} = this.state
    if (lobby.loading) {
      return
    }
    this.refreshErrors()
    let room = lobby.games.find(room => room.roomid === lobbyID)

    if (room.hasPassword) {
      $("#hiddenModalButton").trigger("click")
    } else {
      this.props.setLobbyLoading(true)
      let request = {
        socketId: socket.id,
        password: "",
        name,
        room: lobbyID
      }
      axios
        .post("/joinLobby", request)
        .then(res => {
          if (res?.data?.success) {
            this.props.history.replace({
              pathname: "/play",
              state: {
                isAuthed: true,
                player: res.data.player
              }
            })
          } else {
            this.setState({joinError: "Error joining lobby"})
            this.props.setLobbyLoading(false)
            console.error("unknown error 3")
          }
        })
        .catch(err => {
          console.error(err)
          err?.response?.data?.error ? this.setState({joinError: err.response.data.error}) : this.setState({joinError: "Error joining lobby"})
          this.props.setLobbyLoading(false)
          console.error("unknown error 4")
        })
    }
  }

  filterLobbies = e => {
    this.setState({search: e.target.value})
  }

  backbutton = () => {
    localStorage.removeItem("name")
    this.props.history.replace("/")
  }

  setScene = scene => {
    this.refreshErrors()
    this.setState({scene})
  }

  render() {
    return (
      <div className="background">
        <div className="row" style={{height: "10%"}}>
          <div className="col" />
          <div className="col-3" style={{position: "relative"}}>
            <button className="btn btn-secondary top-button" onClick={() => this.setScene(1)} aria-pressed="false" autoComplete="off">
              Create Lobby
            </button>
          </div>
          <div className="col-3" style={{bottom: 0}}>
            <button className="btn btn-secondary top-button" onClick={() => this.setScene(2)} aria-pressed="false" autoComplete="off">
              Join Lobby
            </button>
          </div>
          <div className="col-3">
            <button className="btn btn-secondary top-button" onClick={() => this.setScene(0)} aria-pressed="false" autoComplete="off">
              About
            </button>
          </div>
          <div className="col" />
        </div>
        {this.state.scene === 0 ? (
          <div className="container d-flex justify-content-center middle-block">
            <div className="my-auto d-flex justify-content-center align-items-center" style={{backgroundColor: "#00000060", width: "70%", height: "40%", border: "3px solid #000", minHeight: 300, minWidth: 700, position: "relative"}}>
              <div>
                <h4>
                  Welcome {this.props.store.name}
                  <br />
                  There {this.props.store.lobby.players === 1 ? "is currently 1 person" : `are currently ${this.props.store.lobby.players} people `} playing.
                </h4>
                <p style={{color: 0x757575}}>
                  <button
                    className="btn btn-link"
                    onClick={() => {
                      this.props.history.replace("/")
                      localStorage.removeItem("name")
                    }}
                  >
                    not you? click here to change your name
                  </button>
                </p>
                <h4>
                  Skull is a 2-6 player game.
                  <br />
                  Skull takes all the good aspects of poker without any of the boring studying.
                </h4>
                <br />
                <h4>
                  You can learn how to play{" "}
                  <a href="https://www.ultraboardgames.com/skull-and-roses/game-rules.php" target="_blank" rel="noopener noreferrer">
                    here!
                  </a>
                </h4>
              </div>
            </div>
          </div>
        ) : this.state.scene === 1 ? (
          <div className="container d-flex justify-content-center middle-block">
            <div className="my-auto" style={{backgroundColor: "#00000060", border: "3px solid #000", minWidth: 500, minHeight: 220, position: "relative"}}>
              <form style={{marginTop: 35}} onSubmit={this.submitLobby}>
                <div style={{display: "block"}}>
                  <h5 style={{display: "inline-block", textAlign: "right", marginRight: 10}}>Lobby Name:</h5>
                  <input type="text" autoComplete="off" className="form-control-md" size="35" id="lobbyName" />
                </div>
                <div className="form-check" style={{marginTop: 5, marginBottom: 5}}>
                  <input type="checkbox" className="form-check-input" id="theCheck" onClick={this.checkboxClick} />
                  <label htmlFor="theCheck" className="form-check-label">
                    Password?
                  </label>
                </div>
                <div style={{display: "block"}}>
                  <h5 style={{display: "inline-block", textAlign: "right", marginRight: 10}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Password:</h5>
                  <input type="text" autoComplete="off" disabled className="form-control-md" size="35" id="lobbyPassword" />
                </div>
                <button type="submit" className="btn btn-secondary">
                  Create Lobby
                </button>
                {this.state.lobbyError && <p className="text-danger">{this.state.lobbyError}</p>}
                {this.state.passwordError && <p className="text-danger">{this.state.passwordError}</p>}
              </form>
            </div>
          </div>
        ) : (
          <Fragment>
            {this.props.store.lobby.games.length === 0 ? (
              <Fragment>
                <p style={{marginTop: 20, fontSize: 30}}>There are no active lobbies.</p>
                <button
                  type="button"
                  className="ml-auto btn btn-secondary float-xs-right"
                  onClick={() => {
                    if (!this.props.store.lobby.loading) this.props.reloadData()
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                    <path fill="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
                  </svg>
                </button>
              </Fragment>
            ) : (
              <div className="container d-flex justify-content-center middle-block">
                <div className="my-auto" style={{backgroundColor: "#00000060", width: "60vw", height: "60vh", border: "3px solid #000", minHeight: 500, minWidth: 500, position: "relative"}}>
                  <div>
                    <nav className="navbar navbar-expand-xs" style={{background: "none", backgroundColor: "transparent"}}>
                      <div className="input-group mb-3" style={{margin: "auto"}}>
                        <ul className="navbar-nav ml-auto" style={{marginLeft: 25}}>
                          <li>
                            <p className="navbar-brand" style={{margin: "auto"}}>
                              Lobby Browser
                            </p>
                          </li>
                        </ul>
                        <input autoComplete="off" className="form-control mr-sm-2" type="search" placeholder="Filter" aria-label="Search" id="lobbySearch" onChange={this.filterLobbies} style={{marginRight: 30, marginLeft: 20}} />
                        <ul className="navbar-nav ml-auto float-xs-right" style={{marginRight: 20}}>
                          <li>
                            <button type="button" className="ml-auto btn btn-secondary float-xs-right" onClick={this.props.reloadData}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                                <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
                              </svg>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </nav>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-fixed">
                      <thead className="thead-dark">
                        <tr>
                          <th scope="col" className="col-3">
                            Name
                          </th>
                          <th scope="col" className="col-3">
                            Host
                          </th>
                          <th scope="col" className="col-3">
                            Players
                          </th>
                          <th scope="col" className="col-3">
                            Password?
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.store.lobby.games
                          .filter(lobby => lobby.name.toLowerCase().includes(this.state.search) || lobby.host.toLowerCase().includes(this.state.search))
                          .map((lobby, idx) => {
                            return (
                              <tr key={idx} onClick={() => this.selectTable(lobby.roomid)} id={lobby.roomid}>
                                <th scope="row" className="col-3 ">
                                  {lobby.name}
                                </th>
                                <th className="col-3">{lobby.host}</th>
                                <th className="col-3">{lobby.players.length}</th>
                                <th className="col-3">{lobby.hasPassword ? "Yes" : "No"}</th>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                  <button id="joinButton" type="button" className="btn btn-secondary" disabled>
                    Join
                  </button>
                  {this.state.joinError && <p className="text-danger">{this.state.joinError}</p>}
                </div>
              </div>
            )}
          </Fragment>
        )}
        <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#joinLobbyModal" hidden="hidden" id="hiddenModalButton">
          lol
        </button>

        <div className="modal fade" id="joinLobbyModal" tabIndex="-1" role="dialog" aria-labelledby="joinLobbyModalCenter" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Password
                </h5>
              </div>
              <div className="modal-body">
                <form onSubmit={this.joinLobbyPassword}>
                  <input type="text" autoComplete="off" className="form-control" id="passwordInput" />
                </form>
              </div>
              <div className="modal-footer">
                {this.state.joinPasswordError && <p className="text-danger">{this.state.joinPasswordError}</p>}
                <button type="button" className="btn btn-secondary" id="closeModal" data-dismiss="modal">
                  Close
                </button>
                <button type="button" className="btn btn-secondary" onClick={this.joinLobbyPassword}>
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#errorModal" hidden="hidden" id="hiddenErrorModalButton">
          lol
        </button>

        <div className="modal fade" id="errorModal" tabIndex="-2" role="dialog" aria-labelledby="errorModalCenter" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Error
                </h5>
              </div>
              <div className="modal-body">{this.props.store.lobby.error}</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" id="closeModal" data-dismiss="modal">
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  store: state
})

const mapActionsToProps = {
  setName,
  setLobbyLoading,
  reloadData
}

export default connect(mapStateToProps, mapActionsToProps)(Lobby)
