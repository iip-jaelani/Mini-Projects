import { Dialog } from "@material-ui/core";
import React, { Component } from "react";
import { Ripple } from "react-spinners-css";

export class LoadingDialog extends Component {
  render() {
    return (
      <Dialog open={true}>
        <div
          style={{
            width: "20vw",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            padding: 20
          }}>
          <Ripple color="#5499C7" />
          <p>Please wait</p>
        </div>
      </Dialog>
    );
  }
}

export default LoadingDialog;
