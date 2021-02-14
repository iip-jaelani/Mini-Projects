import React, { Component } from "react";
//images
import paper2 from "../images/paper2.png";
import paper1 from "../images/paper1.png";
//
import rock1 from "../images/rock1.png";
import rock2 from "../images/rock2.png";
//
import scissors1 from "../images/scissors1.png";
import scissors2 from "../images/scissors2.png";
//
import "./styles/styles.css";
import { Button } from "@material-ui/core";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import io from "socket.io-client";
import { client } from "../config/client";
import DialogContinue from "./components/DialogContinue";
import DialogResultMatch from "./components/DialogResultMatch";

export class Game extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//
			timer: 3,
			pick: null,
			room: this.props.match.params.room,
			rivalPick: null,
			rivalImage: null,
			session: 0,
			countReady: 0,
			dialogShow: true,
			rivalPickResult: {
				room: "",
				name: "",
				result: [],
			},
			youPickResult: {
				room: "",
				name: "",
				result: [],
			},
			message: "",
			yourScore: 0,
			rivalScore: 0,
			dialogEndGame: false,
		};
		this.socket = io(client().defaults.baseURL, {
			transports: ["websocket", "polling", "flashsocket"],
		});
	}
	componentDidMount() {
		this._rivalPick();
		this._confirmGame();
	}
	_confirmGame() {
		const { room } = this.state;
		this.socket.on("rival_ready", (d) => {
			if (d.room === room) {
				this.setState(
					{
						countReady: this.state.countReady + 1,
					},
					() => {
						console.log(this.state.countReady);
						if (this.state.countReady === 2) {
							console.log("start game");
							this.intervalPick();
						}
					}
				);
			}
		});
	}

	_rivalPick() {
		this.socket.on("pick_rival", (data) => {
			const { pick, room, name } = data;
			if (room === this.state.room && this.props.match.params.name !== name) {
				var image = "";
				switch (pick) {
					case 1:
						image = rock1;
						break;
					case 2:
						image = paper1;
						break;
					case 3:
						image = scissors1;
						break;
					default:
						break;
				}
				console.log(image);
				var result = [
					...this.state.rivalPickResult.result,
					{
						pick,
					},
				];
				this.setState({
					rivalPick: pick,
					rivalImage: image,
					rivalPickResult: {
						room,
						name,
						result,
					},
				});
			}
		});
	}

	intervalPick() {
		const { room } = this.state;

		var inter_2 = setInterval(() => {
			var r = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
			this.setState(
				{
					pick: this.state.pick ? this.state.pick : r,
					session: this.state.session + 1,
				},
				() => {
					var result = [
						...this.state.youPickResult.result,
						{
							pick: this.state.pick,
						},
					];
					const { name } = this.props.match.params;
					this.setState({
						youPickResult: {
							room,
							name,
							result,
						},
					});
					this.socket.emit("pick_action", {
						room,
						pick: this.state.pick,
						name: name,
					});
				}
			);
		}, 3000);

		var inter = setInterval(() => {
			if (this.state.session === 5) {
				clearInterval(inter);
				clearInterval(inter_2);
				setTimeout(() => {
					// this.validation();
					this.validationPoint();
				}, 1000);
			}
			if (this.state.timer === 0) {
				this.setState({
					timer: 3,
					rivalImage: null,
					dialogShow: true,
					countReady: 0,
				});

				// this._continueGame();
				this.validationPoint();
				clearInterval(inter);
				clearInterval(inter_2);
			} else {
				this.setState({
					timer: this.state.timer - 1,
				});
			}
		}, 1000);
	}

	// validation() {
	// 	//
	// 	const { rivalPickResult, youPickResult } = this.state;
	// 	var yourScore = 0;
	// 	var rivalScore = 0;
	// 	var winsTo = {
	// 		1: 3,
	// 		2: 1,
	// 		3: 2,
	// 	};
	// 	for (let i = 0; i < 5; i++) {
	// 		const Y = youPickResult.result[i];
	// 		const X = rivalPickResult.result[i];
	// 		const y = Y ? Y.pick : 0;
	// 		const x = X ? X.pick : 0;
	// 		console.log(y, x);
	// 		if (y === x) {
	// 			//
	// 			yourScore += 0;
	// 			rivalScore += 0;
	// 			console.log(`draw ${y}-${x}`);
	// 		} else if (winsTo[y] === x) {
	// 			yourScore += 1;
	// 			console.log(`you win ${y}-${x}`);
	// 			console.log("");
	// 		} else {
	// 			console.log(`rival win ${y}-${x}`);
	// 			rivalScore += 1;
	// 		}
	// 	}
	// 	this.setState({
	// 		yourScore,
	// 		rivalScore,
	// 	});
	// }

	validationPoint() {
		const { pick, rivalPick } = this.state;

		var winsTo = {
			1: 3,
			2: 1,
			3: 2,
		};
		var y = pick;
		var x = rivalPick;
		if (y === x) {
			console.log(`draw ${y}-${x}`);
		} else if (winsTo[y] === x) {
			this.setState({
				yourScore: this.state.yourScore + 1,
				pick: null,
			});
			console.log(`you win ${y}-${x}`);
		} else {
			this.setState({
				rivalScore: this.state.rivalScore + 1,
				pick: null,
			});
			console.log(`rival win ${y}-${x}`);
		}
		this.setState({
			pick: null,
			rivalPick: null,
		});

		if (this.state.yourScore === this.state.rivalScore) {
			if (this.state.session === 5) {
				this.setState({
					message: "DRAW",
					dialogEndGame: true,
				});
			}
		} else if (this.state.yourScore === 3) {
			this.setState({
				message: "YOU WIN",
				dialogEndGame: true,
			});
		} else if (this.state.rivalScore === 3) {
			this.setState({
				message: "YOU LOSE",
				dialogEndGame: true,
			});
		} else {
			if (this.state.session === 5) {
				this.setState({
					message: "You have to get 3 points to win the match",
					dialogEndGame: true,
				});
			}
		}
	}

	handlePickItems = (d) => {
		this.setState({
			pick: d,
		});
	};

	_continueGame() {
		//
		const { room } = this.state;
		const { name } = this.props.match.params;
		this.socket.emit("confirm_ready", { room, name });
		this.setState({
			dialogShow: false,
		});
	}
	_leaveGame() {
		//
		this.setState({
			dialogShow: false,
		});
		this.props.history.push("/");
		//
	}
	_playAgain = () => {
		this.setState({
			timer: 3,
			pick: null,
			room: this.props.match.params.room,
			rivalPick: null,
			rivalImage: null,
			session: 0,
			countReady: 0,
			dialogShow: true,
			rivalPickResult: {
				room: "",
				name: "",
				result: [],
			},
			youPickResult: {
				room: "",
				name: "",
				result: [],
			},
			message: "",
			yourScore: 0,
			rivalScore: 0,
			dialogEndGame: false,
		});
	};
	render() {
		var image = "";
		const {
			rivalImage,
			dialogShow,
			yourScore,
			rivalScore,
			message,
			dialogEndGame,
		} = this.state;
		switch (this.state.pick) {
			case 1:
				image = rock2;
				break;
			case 2:
				image = paper2;
				break;
			case 3:
				image = scissors2;
				break;
			default:
				break;
		}

		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
					backgroundColor: "#fff",
					justifyContent: "space-between",
				}}
			>
				<h1
					style={{
						textAlign: "center",
						margin: 0,
					}}
				>
					Start your game
				</h1>
				<h2
					style={{
						textAlign: "center",
						margin: 0,
					}}
				>
					score:
				</h2>

				<h1
					style={{
						textAlign: "center",
						fontSize: 60,
						margin: 0,
					}}
				>
					{yourScore} - {rivalScore}
				</h1>
				<h1
					style={{
						textAlign: "center",
						// fontSize: 60,
						margin: 0,
					}}
				>
					00.0{this.state.timer}
				</h1>

				<div
					style={{
						backgroundColor: "#fff",
						alignItems: "center",
						display: "flex",
						justifyContent: "center",
					}}
				>
					{this.state.pick ? (
						<img
							className="result-image-left"
							alt="images"
							src={image}
							style={{
								width: "30vw",
							}}
						/>
					) : (
						<div
							style={{
								height: "30vh",
								width: "30vw",
								textAlign: "center",
								justifyContent: "center",
								display: "flex",
								alignItems: "center",
							}}
						>
							<p>waiting. . .</p>
						</div>
					)}
					{rivalImage ? (
						<img
							className="result-image-right"
							alt="images"
							src={rivalImage}
							style={{
								width: "30vw",
							}}
						/>
					) : (
						<div
							style={{
								height: "30vh",
								width: "30vw",
								textAlign: "center",
								justifyContent: "center",
								display: "flex",
								alignItems: "center",
							}}
						>
							<p>waiting. . .</p>
						</div>
					)}
				</div>
				<div
					style={{
						display: "flex",
						padding: 10,
						justifyContent: "center",
					}}
				>
					<SelectionAction
						disabled={this.state.session === 5}
						type={1}
						onPress={this.handlePickItems}
					/>
					<SelectionAction
						disabled={this.state.session === 5}
						type={2}
						onPress={this.handlePickItems}
					/>
					<SelectionAction
						disabled={this.state.session === 5}
						type={3}
						onPress={this.handlePickItems}
					/>
				</div>
				<DialogContinue
					open={dialogShow}
					continueGame={() => this._continueGame()}
					leaveGame={() => this._leaveGame()}
				/>
				<DialogResultMatch
					open={dialogEndGame}
					playAgain={() => this._playAgain()}
					backHome={() => this._leaveGame()}
					score={`${yourScore} - ${rivalScore} `}
					compare={message}
				/>
			</div>
		);
	}
}

export default withRouter(Game);

function SelectionAction({ type, onPress, disabled }) {
	var image = rock2;
	var name = "";
	var value = 0;
	switch (type) {
		case 1:
			image = rock2;
			name = "Rock";
			value = 1;
			break;
		case 2:
			image = paper2;
			name = "Paper";
			value = 2;
			break;
		case 3:
			image = scissors2;
			name = "Scissors";
			value = 3;
			break;
		default:
			break;
	}
	return (
		<Button
			disabled={disabled}
			onClick={() => onPress(value)}
			style={{
				borderRadius: 20,
			}}
		>
			<div
				style={{
					border: "2px solid #aaa",
					borderRadius: 20,
					margin: 5,
				}}
			>
				<img className="image-select" alt="images" src={image} />
				<p>{name}</p>
			</div>
		</Button>
	);
}
