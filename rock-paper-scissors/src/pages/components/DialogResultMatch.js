import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

const DialogResultMatch = ({ playAgain, backHome, open, score, compare }) => {
  const handleClose = (confirm) => {
    if (confirm) {
      playAgain();
    } else {
      backHome();
    }
  };

  return (
    <>
      <div>
        <Dialog
          maxWidth="md"
          open={open}
          // onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogContent>
            <DialogContentText style={{}} id="alert-dialog-description">
              <div
                style={{
                  width: "50vw",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center"
                }}>
                <h1>{compare}</h1>
                <h1>{score}</h1>
                <p>Please click yes to play again</p>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions
            style={{
              alignItems: "center",
              justifyContent: "center"
            }}>
            <Button
              style={{
                backgroundColor: "red",
                color: "#fff",
                borderRadius: 100,
                minWidth: "10vw"
              }}
              onClick={() => handleClose(false)}>
              No
            </Button>
            <Button
              style={{
                backgroundColor: "#3498DB",
                borderRadius: 100,
                minWidth: "10vw",
                color: "#fff"
              }}
              onClick={() => handleClose(true)}
              autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default DialogResultMatch;
