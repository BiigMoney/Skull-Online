import React from "react";
import axios from "axios"

export default class Lobby extends React.Component {

    state = {
        isLoading: true,
        name: null,
        players: null,
        lobbies: null,
        errors: null
    }

    componentDidMount() {
        this.setState({
            name: localStorage.getItem('name')
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

	render() {
		return (
            <div>
			<div style={{ textAlign: "center" }}>
				<h1>Lobby Time!</h1>
			</div>
            {this.state.isLoading ? (
                <div>
                    <h4>Welcome {this.state.name}</h4>
                    <h4>There are currently {this.state.players.length} people playing.</h4>
                    {this.state.lobbies.map(lobby =>{
                        return(
                            <div>
                                <h3>{lobby.name}</h3>
                            </div>
                        )
                    })}
                </div>
            ) : <div></div>}
            </div>
		);
	}
}
