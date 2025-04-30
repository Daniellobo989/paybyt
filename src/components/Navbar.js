import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Badge,
  IconButton,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Menu as MenuIcon,
  AccountCircle,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { cartItems } = useCart();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const menuItems = [
    { text: 'Início', path: '/' },
    { text: 'Produtos', path: '/products' },
  ];

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box
            component="img"
            src="/images/logo.png"
            alt="PayByt Logo"
            sx={{ height: 40, filter: 'brightness(0) invert(1)' }}
          />
        </RouterLink>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleMenuClick}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  onClick={handleMenuClose}
                >
                  {item.text}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                component={RouterLink}
                to={item.path}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}

        <IconButton
          color="inherit"
          component={RouterLink}
          to="/cart"
          sx={{ ml: 2 }}
        >
          <Badge badgeContent={cartItemCount} color="secondary">
            <CartIcon />
          </Badge>
        </IconButton>

        {currentUser && currentUser.isAdmin && (
          <Button
            component={RouterLink}
            to="/admin"
            color="inherit"
            startIcon={<AdminPanelSettings />}
            sx={{ ml: 2 }}
          >
            Admin
          </Button>
        )}

        {currentUser ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleMenuClick}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                component={RouterLink}
                to="/profile"
                onClick={handleMenuClose}
              >
                Profile
              </MenuItem>
              <MenuItem
                component={RouterLink}
                to="/orders"
                onClick={handleMenuClose}
              >
                My Orders
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button
              component={RouterLink}
              to="/login"
              color="inherit"
              sx={{ ml: 1 }}
            >
              Login
            </Button>
            <Button
              component={RouterLink}
              to="/register"
              color="inherit"
            >
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 