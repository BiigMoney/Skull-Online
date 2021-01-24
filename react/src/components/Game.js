import React from "react";
import Skull from "./Skull"

export default class Game extends React.Component {

    state = {
        isAuthed: false
    }

    componentDidMount(){
        if(this.props.location.state){
            if(this.props.location.state.isAuthed){
                this.setState({
                    isAuthed: true
                })
                const {location,history} = this.props;
                history.replace()
                return
            }
        }
        this.props.history.push("/lobby")

    }
	render() {
		return (
			<div style={{ textAlign: "center" }}>
			{this.state.isAuthed ? (
                <div>
                    <h1>User is authed</h1>
                    <Skull/>
                </div>
                ) : <h1>User is not authed</h1>}
			</div>
		);
	}
}
