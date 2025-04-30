import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useDeliveryService } from '../../services/deliveryService';

const AdminDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const deliveryService = useDeliveryService();

  useEffect(() => {
    fetchDeliveries();
  }, [statusFilter]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const data = await deliveryService.getAllDeliveries();
      const filteredDeliveries = statusFilter === 'all'
        ? data
        : data.filter(delivery => delivery.status === statusFilter);
      setDeliveries(filteredDeliveries);
      setError('');
    } catch (err) {
      setError('Failed to fetch deliveries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (deliveryId, newStatus) => {
    try {
      await deliveryService.updateDeliveryStatus(deliveryId, newStatus);
      fetchDeliveries();
    } catch (err) {
      setError('Failed to update delivery status');
      console.error(err);
    }
  };

  const handleOpenDialog = (delivery = null) => {
    setCurrentDelivery(delivery);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentDelivery(null);
  };

  const handleUpdateTracking = async (deliveryId, trackingData) => {
    try {
      await deliveryService.updateTracking(deliveryId, trackingData);
      fetchDeliveries();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to update tracking information');
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_transit':
        return 'info';
      case 'out_for_delivery':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Deliveries</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Deliveries</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_transit">In Transit</MenuItem>
            <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Delivery ID</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tracking Number</TableCell>
              <TableCell>Last Update</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveries.map((delivery) => (
              <TableRow key={delivery._id}>
                <TableCell>{delivery._id}</TableCell>
                <TableCell>{delivery.order}</TableCell>
                <TableCell>
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={delivery.status}
                      onChange={(e) => handleStatusChange(delivery._id, e.target.value)}
                      size="small"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in_transit">In Transit</MenuItem>
                      <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="failed">Failed</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>{delivery.trackingNumber || 'N/A'}</TableCell>
                <TableCell>{new Date(delivery.updatedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(delivery)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => window.location.href = `/deliveries/${delivery._id}`}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TrackingDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleUpdateTracking}
        delivery={currentDelivery}
      />
    </Box>
  );
};

const TrackingDialog = ({ open, onClose, onSave, delivery }) => {
  const [formData, setFormData] = useState({
    trackingNumber: '',
    carrier: '',
    estimatedDelivery: '',
  });

  useEffect(() => {
    if (delivery) {
      setFormData({
        trackingNumber: delivery.trackingNumber || '',
        carrier: delivery.carrier || '',
        estimatedDelivery: delivery.estimatedDelivery || '',
      });
    } else {
      setFormData({
        trackingNumber: '',
        carrier: '',
        estimatedDelivery: '',
      });
    }
  }, [delivery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(delivery._id, formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Tracking Information</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Tracking Number"
            name="trackingNumber"
            value={formData.trackingNumber}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Carrier"
            name="carrier"
            value={formData.carrier}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Estimated Delivery"
            name="estimatedDelivery"
            type="datetime-local"
            value={formData.estimatedDelivery}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminDeliveries; 