import React from "react"
import Skull from "./Skull"

export default class Game extends React.Component {
  state = {
    isAuthed: false,
    player: null,
    socket: null
  }

  componentDidMount() {
    const {state} = this.props.location
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
    return <div style={{textAlign: "center"}}>{this.state.isAuthed ? <Skull history={this.props.history} player={this.state.player} socket={this.props.socket} /> : <h1>User is not authed</h1>}</div>
  }
}
