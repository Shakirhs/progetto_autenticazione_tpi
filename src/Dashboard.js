import React, { Component } from "react";
import CiboItem from "./CiboItem"

export default class Dashboard extends Component {

	state = {
		nome: "",
		cognome: "",
		sesso: "",
		eta: 0,
		peso: 0,
		altezza: 0,
		fabbisogno: 0,
		consumato: 0,
		cibo: "",
		calorie: 0,
		cibi: []
	}

	componentDidMount() {
		const token = localStorage.getItem('jwt')
		if (!token) {
			localStorage.clear();
			return
		}
		fetch("https://fitness-diary--shakirhs.repl.co/api",
			{
				headers:
					{ "x-access-token": token }
			})
			.then(r => r.json())
			.then(b => {
				this.setState(
					{
						nome: b.nome,
						cognome: b.cognome,
						sesso: b.sesso,
						eta: b.eta,
						peso: b.peso,
						altezza: b.altezza
					})
				this.calcolaFabbisogno()
			})

	}

	calcolaFabbisogno = () => {
		let kCal = 1
		const ADS = 0.30
		if (this.state.sesso === "F") {
			kCal = 0.9
		}
		const fabbisogno = kCal * this.state.peso * 24
		this.setState(
			{ fabbisogno: (fabbisogno + (fabbisogno * ADS)) })
	}

	calcolaConsumo = () => {
		let calorie = 0
		this.state.cibi.forEach(cibo => {
			calorie += parseInt(cibo.calorie)
		})
		const consumato = parseInt(calorie)
		this.setState({ consumato: consumato })
	}

	addCibo = () => {
		const { cibo, calorie, cibi } = this.state
		const id = Date.now()
		let flag = true
		cibi.forEach(c => {
			if (c.cibo.toLowerCase() === cibo.toLowerCase()) {
				c.calorie = parseInt(c.calorie) + parseInt(calorie)
				flag = false
			}
		})
		if (flag)
			cibi.push({ id, cibo, calorie })
		this.setState({ cibi: cibi })
		this.calcolaConsumo()
	}

	deleteCibo = async (id) => {
		const filteredCibi = this.state.cibi.filter(c => c.id !== id)
		await this.setState({ cibi: filteredCibi })
		this.calcolaConsumo()
	}



	render() {
		return (
			<div>
				<h1>Ciao {this.state.nome} {this.state.cognome}</h1>
				<h2>Il tuo fabbisogno giornaliero è {this.state.fabbisogno} Kcal</h2>
				<h4>Oggi hai consumato {this.state.consumato} Kcal, ti mancano {this.state.fabbisogno - this.state.consumato} Kcal</h4>
				<p>Inserisci cibo</p>
				<div>
					Nome
					<input type="text" onChange={e => this.setState({ cibo: e.target.value })} />
					<br />
					Calorie
					<input type="number" name="calorie" id="calorie" onChange={e => this.setState({ calorie: e.target.value })} />
					<button onClick={this.addCibo}>+</button>
				</div>
				<div>
					{this.state.cibi.map(cibo => {
						return (
							<CiboItem key={cibo.id} cibo={cibo} deleteCibo={this.deleteCibo} />
						)
					})}
				</div>
			</div>
		)
	}
}