import React from "react"
import LoadingSkull from "./LoadingSkull"
import Skull from "./Skull"

export default class Game extends React.Component {
  state = {
    loading: true,
    isAuthed: false,
    player: null
  }

  componentDidMount() {
    const {state} = this.props.location
    if (state && state.isAuthed) {
      this.setState({isAuthed: true, player: state.player, loading: false})
      this.props.history.replace({
        state: {}
      })
      return
    }
    this.setState({loading: false})
    this.props.history.replace("/lobby")
  }
  render() {
    return <div style={{textAlign: "center"}}>{this.state.isAuthed ? <Skull player={this.state.player} history={this.props.history} /> : this.state.loading ? <LoadingSkull /> : <h1>User is not authed</h1>}</div>
  }
}
