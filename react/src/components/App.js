import React from "react";
import Skull from "./Skull"

export default class App extends React.Component {


	render() {
		return (
			<div style={{ textAlign: "center" }}>
				<h1>Hello World</h1>
				<Skull/>
			</div>
		);
	}
}
