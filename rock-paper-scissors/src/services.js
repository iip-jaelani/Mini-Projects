import * as React from "react";
import Axios from "axios";
import io from "socket.io-client";
import { client } from "./config/client";

export class services extends React.Component {
	constructor(props) {
		super(props);
		this.socket = io(client().defaults.baseURL, {
			transports: ["websocket", "polling", "flashsocket"],
		});
	}
	socketListener = async (event) => {
		return this.socket.on(event, (data) => {
			return data;
		});
	};

	connectSocket(name) {
		this.socket.emit("new user", name);
		this.socket.emit("createRoom", name);
	}
	roomList = () => {
		return new Promise((res, rej) => {
			client()
				.get("/list_users")
				.then((response) => {
					res(response.data);
				})
				.catch((e) => {
					rej(e);
				});
		});
	};
}
