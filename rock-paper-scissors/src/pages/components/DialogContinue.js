import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const DialogContinue = ({ continueGame, leaveGame, data, open }) => {
	const handleClose = (confirm) => {
		if (confirm) {
			continueGame();
		} else {
			leaveGame();
		}
	};

	return (
		<div>
			<Dialog
				open={open}
				// onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Start your game</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Please click yes to start the game
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleClose(false)} color="primary">
						No
					</Button>
					<Button onClick={() => handleClose(true)} color="primary" autoFocus>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default DialogContinue;
