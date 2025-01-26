import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { Close } from "@mui/icons-material";

const CustomModal = ({ open, onClose, title, children, onSave, loading }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onSave} color="primary" variant="contained" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <Button onClick={onClose} color="error" variant="contained" startIcon={<Close />}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;