import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import React, { Component } from "react";

export class ListRoom extends Component {
  render() {
    const { username, data, onclick } = this.props;
    return (
      <ListItem
        style={{
          borderRadius: 10,
          backgroundColor: "#fff",
          marginTop: 10
        }}
        disabled={username.length < 3}
        button
        onClick={onclick}>
        <ListItemAvatar>
          <Avatar />
        </ListItemAvatar>
        <ListItemText
          primary={`${data.username}`}
          secondary={
            <p>
              {data.onGame ? (
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
  }
}

export default ListRoom;
