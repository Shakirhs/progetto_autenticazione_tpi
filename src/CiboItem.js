import React, { Component } from 'react'

export class CiboItem extends Component {
	// Questa funzione controlla se il todo è markato come completato, e di conseguenza gli applica il corretto stile


	render() {
		// Questa operazione estrae i seguenti parametri dall'object todo
		// Viene definito "destructuring"
		const { id, cibo, calorie } = this.props.cibo
		return (
			<div>
				<p>
					{cibo}
					{calorie}
					<button onClick={this.props.deleteCibo.bind(this, id)}>X</button>
				</p>
			</div>
		)
	}
}

export default CiboItem