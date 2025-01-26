import React from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Typography
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const ConfirmationDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title = "Confirmation",
  message = "Êtes-vous sûr de vouloir fermer sans sauvegarder les modifications ?",
  cancelText = "Annuler",
  confirmText = "Fermer sans sauvegarder"
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color="warning" />
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelText}
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;