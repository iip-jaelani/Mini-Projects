import React, { Component } from "react";
import { Button, Grid, Paper, TextField, withStyles, List } from "@material-ui/core";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { services } from "../services";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { client } from "../config/client";
import LoadingDialog from "./components/LoadingDialog";
import { connect } from "react-redux";

import { createRoom } from "../redux/actions/auth.action";
import "../App.css";
import "./styles/signin.css";
import ListRoom from "./components/ListRoom";

const CssTextField = withStyles({
  root: {
    "& .MuiInput-underline:after": {
      borderBottomColor: "#aaa"
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "#AEB6BF"
    }
  }
})(TextField);

export class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      disabled: false,
      rooms: [],
      id: "",
      isLoading: false
    };
    this.service = new services();
    this.socket = io(client().defaults.baseURL, {
      transports: ["websocket", "polling", "flashsocket"]
    });
  }
  componentDidMount() {
    this._getListRoom();
    this._waitingConfirmRoom();
    this._validateRoom();
  }
  _validateRoom() {
    this.socket.on("confirm_create", (res) => {
      const { error, room, username } = res;
      if (username === this.state.username) {
        if (error) {
          alert("the room already exists");
        } else {
          this.props.createRoom({ username, room });
          this.props.history.push(`/home/${room}/${username}`);
        }
      }
    });
  }
  _waitingConfirmRoom() {
    this.setState({
      isLoading: false
    });
    this.socket.on("confirm", (res) => {
      const { confirm, data } = res;
      const { room, username } = data;
      if (username === this.state.username) {
        if (confirm) {
          this.props.history.push(`/game/${room}/${username}`);
        } else {
          alert("Your invitation is rejected");
          this.setState({
            isLoading: false
          });
        }
      }
    });
  }
  _getListRoom() {
    this.service.roomList().then((d) => {
      this.setState({
        rooms: d.room
      });
    });
    this.socket.on("rooms", (room) => {
      console.log({ room });
      this.setState({
        rooms: room
      });
    });
  }
  usernameInput = (e) => {
    const { value } = e.target;
    this.setState({
      username: value,
      disabled: value.length > 2
    });
  };
  _continue = () => {
    const { username } = this.state;
    const room = uuidv4();
    this.socket.emit("createRoom", { username, room });
  };

  join(d) {
    const { room } = d;
    const data = {
      username: this.state.username,
      room
    };
    this.setState({
      id: room,
      isLoading: true
    });
    this.socket.emit("join", data);
    // this.props.history.push(`/home/${room}`);
  }

  render() {
    const { isLoading, username } = this.state;
    const { authReducers } = this.props;
    const { myRoom } = authReducers;
    return (
      <div className="container">
        <Paper elevation={5} className="sub-container">
          <div className="header-container">
            <p className="label-header">Rock Paper Scissors Game</p>
          </div>
          <Grid className="grid-container" container spacing={0}>
            <Grid item xs={12} sm={6} lg={6}>
              <div className="item-grid-container">
                <h1>Username</h1>
                <div className="container-input">
                  <CssTextField
                    autoFocus
                    onChange={this.usernameInput}
                    type="text"
                    autoComplete="current-password"
                    margin="normal"
                    style={{
                      fontSize: 20
                    }}
                    placeholder="***"
                    inputProps={{
                      style: {
                        fontSize: 30,
                        fontWeight: "bold",
                        textAlign: "center"
                      }
                    }}
                  />
                </div>
                <div className="container-button">
                  <Button
                    onClick={this._continue}
                    disabled={!this.state.disabled}
                    style={{
                      backgroundColor: !this.state.disabled ? "#D6EAF8" : "#5499C7",
                      borderRadius: 100,
                      color: "#fff",
                      textTransform: "capitalize"
                    }}>
                    Create Room
                  </Button>
                </div>
              </div>
            </Grid>
            <Grid className="item-second-grid" item xs={12} sm={6} lg={6}>
              <div className="sub-item-second-grid">
                <p>List user</p>
                <List className="list-container" component="nav" aria-label="main mailbox folders">
                  {this.state.rooms.map((d) => {
                    if (d.room === myRoom.room || "") {
                      return <div />;
                    }
                    return <ListRoom username={username} data={d} onclick={() => this.join(d)} />;
                  })}
                </List>
              </div>
            </Grid>
          </Grid>
        </Paper>
        {isLoading && <LoadingDialog />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authReducers: state.authReducers
});

const mapDispatchTopProps = (dispatch) => ({
  createRoom: (body) => dispatch(createRoom(body))
});

export default connect(mapStateToProps, mapDispatchTopProps)(withRouter(SignIn));
