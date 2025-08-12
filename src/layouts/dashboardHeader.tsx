
// components/DashboardHeader.tsx
import React, { useState, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Image, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import http from '../services/http.services';
import { userMenu, menuItems, User, MenuItem, formatDate, iconMap } from './header-menu-items';
import { LogoutIcon, PasswordIcon, ProfileV2Icon } from "../shared/icons";
import { API_BASE_URL } from '../config';


interface UserMenuItem {
  title: string;
  icon: string;
  action: string;
  isOffcanvas?: boolean;
}

interface DashboardHeaderProps {
  brandLogo?: string;
  onSidebarToggle?: () => void;
  userProfileEndpoint?: string;
  className?: string;  
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  brandLogo = '/Logo-Green-Trans.png',
  onSidebarToggle,
  userProfileEndpoint = API_BASE_URL,
  className
}) => {
  const { user_image } = JSON.parse(localStorage.getItem("user") || "{}");
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userData: User = JSON.parse(localStorage.getItem('user') || '{}');

  const hasPermission = useCallback((requiredPermissions?: string[]) => {
    if (!requiredPermissions) return true;
    return requiredPermissions.some(permission =>
      userData.permissions?.includes(permission)
    );
  }, [userData.permissions]);
  /* 
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = '/avatar.svg';
    };
  
    const handleMenuItemClick = (e: React.MouseEvent, item: UserMenuItem) => {
      e.preventDefault();
      if (item.action === 'logout') {
        handleLogout(e);
      } else if (item.isOffcanvas) {
        handleOffcanvasToggle(item.action);
      }
    };
   */
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      try {
        await http.get('/api_user_logout.php');
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(';').forEach(cookie => {
          document.cookie = cookie
            .replace(/^ +/, '')
            .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Logout failed:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to logout. Please try again.',
          icon: 'error'
        });
      }
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    if (!hasPermission(item.permission)) return null;

    if (item.children) {
      return (
        <NavDropdown
          title={
            <span>
              {item.icon}
              <span className="ms-2">{item.title}</span>
            </span>
          }
          id={`nav-dropdown-${item.title.toLowerCase()}`}
        // active={item.children.some(child => location.pathname === child.path)}
        >
          {item.children.map((child, index) => (
            <NavDropdown.Item
              key={index}
              as={NavLink}
              to={child.path}
              disabled={child.disabled}
            >
              {child.icon}
              <span className="ms-2">{child.title}</span>
              {child.badge && (
                <Badge
                  bg={child.badge.variant}
                  className="ms-2"
                >
                  {child.badge.text}
                </Badge>
              )}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      );
    }

    return (
      <Nav.Link
        as={NavLink}
        to={item.path}
        disabled={item.disabled}
      >
        {item.icon}
        <span className="ms-2">{item.title}</span>
      </Nav.Link>
    );
  };

  const handleOffcanvasToggle = (target: string) => {
    const element = document.querySelector(target);
    if (element) {
      // const offcanvas = new window.bootstrap.Offcanvas(element);
      // offcanvas.show();
    }
  };

  return (
    <Navbar
      bg="light"
      expand="lg"
      className={`shadow-sm sticky-top ${className}`}
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container fluid>
        {onSidebarToggle && (
          <button
            className="btn btn-link d-lg-none me-2"
            onClick={onSidebarToggle}
            aria-label="Toggle Sidebar"
          >
            <i className="fas fa-bars"></i>
          </button>
        )}

        {/* Brand on the left */}
        <Navbar.Brand as={Link} to="/ace/landing" className="me-0">
          <Image
            src={brandLogo}
            alt="Logo"
            style={{ height: '80px', width: 'auto' }}
            className="me-auto"
            title="Home"
          />
        </Navbar.Brand>

        {/* Centered menu items */}
        <Navbar.Toggle aria-controls="dashboard-navbar" />
        <Navbar.Collapse id="dashboard-navbar">
          <Nav className="mx-auto">
            {menuItems.map((item, index) => (
              <Nav.Item key={index}>
                {renderMenuItem(item)}
              </Nav.Item>
            ))}
          </Nav>

          {/* User menu on the right */}
          <div className="d-lg-flex col-lg-3 justify-content-lg-end">
            <div className="dropdown">
              <Link
                className="nav-link text-end"
                to={"#"}
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <label htmlFor="">
                  <p
                    className="mb-0 fw-bold"
                    style={{ textTransform: "capitalize" }}
                  >
                    {localStorage.getItem("isLoggedIn") &&
                      JSON.parse(localStorage.getItem("user")!).user_fname +
                      " " +
                      JSON.parse(localStorage.getItem("user")!).user_lname}
                  </p>
                  <small className="text-muted">
                    Last login:{" "}
                    {localStorage.getItem("isLoggedIn") &&
                      JSON.parse(localStorage.getItem("user")!).user_lasllogin}
                  </small>
                </label>
                <img
                  src={`${API_BASE_URL}/${user_image}`}
                  alt="userAvatar"
                  className="ms-2 rounded-circle border border-2 border-dark"
                  style={{
                    width: "48px",
                    height: "48px",
                    verticalAlign: "bottom",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "avatar.svg";
                  }}
                />
              </Link>

              <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0">
                <li>
                  <Link
                    className="dropdown-item"
                    data-bs-toggle="offcanvas"
                    to={"#userProfileCanvas"}
                    role="button"
                    aria-controls="userProfileCanvas"
                  >
                    <ProfileV2Icon />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    data-bs-toggle="offcanvas"
                    to={"#changePasswordCanvas"}
                    role="button"
                    aria-controls="changePasswordCanvas"
                  >
                    <PasswordIcon />
                    Change Password
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to={"#"} onClick={handleLogout}><LogoutIcon /> Logout </Link>
                </li>
              </ul>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
};