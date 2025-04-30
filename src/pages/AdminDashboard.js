import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminDeliveries from '../components/admin/AdminDeliveries';
import AdminUsers from '../components/admin/AdminUsers';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      setError('Access denied. Admin privileges required.');
    }
    setLoading(false);
  }, [currentUser]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="admin tabs">
          <Tab label="Products" />
          <Tab label="Orders" />
          <Tab label="Deliveries" />
          <Tab label="Users" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AdminProducts />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AdminOrders />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AdminDeliveries />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AdminUsers />
      </TabPanel>
    </Container>
  );
};

export default AdminDashboard; 