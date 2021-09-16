import skullGif from "../assets/spinny3.gif"
import React from "react"

function LoadingSkull(props) {
	return (
		<div>
			<img src={skullGif} alt="Spinning Skull" width="500"/>
		</div>
	);
}

export default LoadingSkull;