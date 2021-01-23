import React from "react";

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
		localStorage.setItem('name', name)
		this.props.history.push(`/lobby`)
	}

	render() {
		return (
			<div style={{ textAlign: "center" }}>
				<h1>Welcome!</h1>
				<h3>Enter your name to get started.</h3>
				<form onSubmit={this.submitName}>
					<input id="name" autoComplete="off"/>
				</form>
				{this.state.errors ? <div><h5>{this.state.errors}</h5></div> : <div></div>}
			</div>
		);
	}
}
