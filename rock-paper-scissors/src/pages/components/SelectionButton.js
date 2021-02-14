import { Button } from "@material-ui/core";
import React, { Component } from "react";
import paper2 from "../../images/paper2.png";
import rock2 from "../../images/rock2.png";
import scissors2 from "../../images/scissors2.png";

export class SelectionButton extends Component {
  render() {
    const { disabled, onClick, type } = this.props;
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
      <div>
        <Button
          disabled={disabled}
          onClick={() => onClick(value)}
          style={{
            borderRadius: 20
          }}>
          <div
            style={{
              border: "2px solid #aaa",
              borderRadius: 20,
              margin: 5
            }}>
            <img className="image-select" alt="images" src={image} />
            <p>{name}</p>
          </div>
        </Button>
      </div>
    );
  }
}

export default SelectionButton;
