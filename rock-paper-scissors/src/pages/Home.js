import React, { Component } from "react";
import { services } from "../services";
import { Colors } from "../styles/colors";
import io from "socket.io-client";
import { Link, withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Collapse, IconButton } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import { Alert } from "@material-ui/lab";
import { Close } from "@material-ui/icons";
import DialogUsersJoin from "./components/DialogUsersJoin";
import { client } from "../config/client";

export class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userList: [],
			alertJoin: false,
			message: "",
			rivalData: null,
		};
		this.services = new services();
		this.socket = io(client().defaults.baseURL, {
			transports: ["websocket", "polling", "flashsocket"],
		});
	}
	componentDidMount() {
		this.onUserJoin();
	}
	onUserJoin() {
		this.socket.on("ready", (data) => {
			const { room } = this.props.match.params;
			if (room === data.room) {
				this.setState({
					alertJoin: true,
					message: `${data.username} join game!`,
					rivalData: data,
				});
			}
		});
	}
	_continue() {
		console.log("users");
		const { room, name } = this.props.match.params;
		console.log(room);
		this.setState({
			alertJoin: false,
		});
		this.props.history.push(`/game/${room}/${name}`);
		const { rivalData } = this.state;
		this.socket.emit("confirm_room", { confirm: true, data: rivalData });
	}
	_rejectUsers() {
		this.setState({
			alertJoin: false,
		});
		const { rivalData } = this.state;
		this.socket.emit("confirm_room", { confirm: false, data: rivalData });
	}
	render() {
		const { alertJoin, rivalData } = this.state;
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
					backgroundColor: Colors.primary,
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<p>Waiting for a friend to play . . .</p>
				<DialogUsersJoin
					data={rivalData}
					open={alertJoin}
					continueToGame={() => this._continue()}
					userReject={() => this._rejectUsers()}
				/>
			</div>
		);
	}
}

export default withRouter(Home);
