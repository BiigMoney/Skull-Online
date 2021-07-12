import React from "react";
import background from "../assets/table.JPG"

export default class WelcomePage extends React.Component {

	state = {
		errors: null
	}

	componentDidMount() {
		let name = localStorage.getItem('name')
		console.log(name)
		if(!(name === null) && !(name === "")){
			this.props.history.push(`/lobby`)
		}
	}

	submitName = (e) => {
		e.preventDefault()
		let name = document.getElementById("name").value
		if(name === null || name.length === 0){
			this.setState({
				errors: "Name cannot be empty"
			})
			return
		}
		if(name.length > 20){
			this.setState({
				errors: "Name cannot be longer than 20 characters"
			})
			return
		}
		localStorage.setItem('name', name)
		this.props.history.push(`/lobby`)
	}

	render() {
		return (
			<div style={{backgroundImage: `url(${background})`, textAlign: "center", width: "100%",  height: "100%", position: "absolute", top: 0, left: 0}}>
				<h1 style={{marginTop: 30}}>Welcome to Skull Online!</h1>
				<h3>Enter your name to get started.</h3>
				<div className="form-center">
				<form onSubmit={this.submitName}>
					<div className="form-group">
					<input className="form-control-lg" type="text" size="50" id="name" autoComplete="off"/>
					</div>
					<button className="btn btn-primary" style={{marginTop: 10}} type="submit">Play</button>
				</form>
				</div>
				{this.state.errors ? <div><h5>{this.state.errors}</h5></div> : <div></div>}
			</div>
		);
	}
}
