import React, { Component } from "react";
import { Button, Grid, Paper, TextField, withStyles, ListItem, List, ListItemText, ListItemAvatar, Avatar } from "@material-ui/core";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { services } from "../services";
import { Colors } from "../styles/colors";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { client } from "../config/client";
import LoadingDialog from "./components/LoadingDialog";
import { connect } from "react-redux";

import { createRoom } from "../redux/actions/auth.action";
import "../App.css";
import "./styles/signin.css";

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
      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: "100vh",
          justifyContent: "center",
          backgroundColor: Colors.primary
        }}>
        <Paper
          elevation={5}
          style={{
            display: "flex",
            alignSelf: "center",
            backgroundColor: "#fff",
            height: "60vh",
            width: "60vw",
            borderRadius: 3,
            flexDirection: "column",
            overflow: "hidden"
          }}>
          <div
            style={{
              backgroundColor: "#5499C7",
              width: "100%",
              padding: 10
            }}>
            <p
              style={{
                color: "#fff",
                fontWeight: "bold"
              }}>
              Rock Paper Scissors Game
            </p>
          </div>
          <Grid
            style={{
              // backgroundColor: "#efefef",
              height: "100%",
              display: "flex",
              flex: 1
            }}
            container
            spacing={0}>
            <Grid item xs={12} sm={6} lg={6}>
              <div
                style={{
                  padding: 10,
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                <h1
                  style={{
                    textAlign: "center"
                  }}>
                  Username
                </h1>
                <div
                  style={{
                    padding: "20%",
                    paddingTop: 0,
                    paddingBottom: 0,
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
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
                <div
                  style={{
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "10%"
                  }}>
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
            <Grid
              style={{
                backgroundColor: "#efefef",
                height: "100%",
                display: "flex",
                flex: 1,
                width: "100%"
              }}
              item
              xs={12}
              sm={6}
              lg={6}>
              <div
                style={{
                  padding: 10,
                  // backgroundColor: "red",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  width: "100%"
                }}>
                <p>List user</p>
                <List
                  style={{
                    maxHeight: "45vh",
                    overflow: "auto"
                  }}
                  component="nav"
                  aria-label="main mailbox folders">
                  {this.state.rooms.map((d) => {
                    if (d.room === myRoom.room || "") {
                      return <div />;
                    }
                    return (
                      <ListItem
                        style={{
                          borderRadius: 10
                        }}
                        disabled={username.length < 3}
                        button
                        onClick={() => this.join(d)}>
                        <ListItemAvatar>
                          <Avatar />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${d.username}`}
                          secondary={
                            <p>
                              {d.onGame ? (
                                <span
                                  style={{
                                    color: "red"
                                  }}>
                                  In game
                                </span>
                              ) : (
                                <span
                                  style={{
                                    color: "#52BE80"
                                  }}>
                                  Waiting for friends to play
                                </span>
                              )}
                            </p>
                          }
                        />
                      </ListItem>
                    );
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
