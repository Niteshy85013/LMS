import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
} from "@mui/material"
import { useUser } from "../../context/user-context"
import { Route, Routes, Navigate, Link } from "react-router-dom"

import { BooksList } from "../books-list/books-list"
import { LoginDialog } from "../login/login-dialog"
import { BookForm } from "../book-form/book-form"
import { Book } from "../book/book"
import { WithLoginProtector } from "../access-control/login-protector"
import { WithAdminProtector } from "../access-control/admin-protector"
import { DashboardList } from "../dashboard/dashboard"


export const AppLayout = () => {

    const [openLoginDialog, setOpenLoginDialog] = useState(false)
    const [anchorElUser, setAnchorElUser] = useState(null)
    const { user, loginUser, logoutUser, isAdmin } = useUser()
    const navigate = useNavigate()

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    const handleMenuItemClick = () => {
        navigate("/dashboard"); // Navigate to the /dashboard route
      };

    const handleLoginSubmit = (username, password) => {
        loginUser(username, password)
        setOpenLoginDialog(false)
    }

    const handleLoginClose = () => {
        setOpenLoginDialog(false)
    }

    const handleLogout = () => {
        logoutUser()
        handleCloseUserMenu()
    }

    useEffect(() => {
        if (!user) {
            navigate("/")
        } else if (isAdmin) {
            navigate("/admin/books/")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isAdmin])

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: "#8ecae6" }}>
    <Container maxWidth="xl">
        <Toolbar disableGutters>
            <Box 
                component="img" 
                src="/logo.png" 
                alt="Logo" 
                sx={{ display: "flex", mr: 1, height: 50, width: 50 }} 
            />
            <Link to="/" style={{ textDecoration: "none", flexGrow: 1 }}>
                <Typography
                    variant="h6"
                    noWrap
                    sx={{
                        mr: 2,
                        display: "flex",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        letterSpacing: ".3rem",
                        color: "black", // This keeps the text white for contrast
                    }}
                >
                    HamroKitab
                </Typography>
            </Link>
            <Box
                sx={{
                    flexGrow: 0,
                }}
            >
                {user ? (
                    <>
                        <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
    <Avatar sx={{ backgroundColor: "#e76f51" }}>
        {user.username.charAt(0).toUpperCase()}
    </Avatar>
</IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleMenuItemClick}>
                                <Typography textAlign="center">Dashboard</Typography>
                            </MenuItem>
                            {/* <MenuItem onClick={() => { 
  handleCloseUserMenu(); 
  navigate('/dashboard'); // Navigate to the dashboard route
}}>
  <Typography textAlign="center">Dashboard</Typography>
</MenuItem> */}
                            <MenuItem onClick={handleLogout}>
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Button
                        onClick={() => {
                            setOpenLoginDialog(true)
                        }}
                        sx={{ my: 2, color: "red", display: "block", fontWeight: "bold" }}
                    >
                        Login
                    </Button>
                )}
            </Box>
        </Toolbar>
    </Container>
</AppBar>

            <Routes>
                <Route path="/books" exact element={<BooksList />} />
                <Route path="/dashboard" exact element={<DashboardList />} />
                <Route
                    path="/books/:bookIsbn"
                    element={
                        <WithLoginProtector>
                            <Book />
                        </WithLoginProtector>
                    }
                />
                <Route
                    path="/admin/books/add"
                    element={
                        <WithLoginProtector>
                            <WithAdminProtector>
                                <BookForm />
                            </WithAdminProtector>
                        </WithLoginProtector>
                    }
                    exact
                />
                <Route
                    path="/admin/books/:bookIsbn/edit"
                    element={
                        <WithLoginProtector>
                            <WithAdminProtector>
                                <BookForm />
                            </WithAdminProtector>
                        </WithLoginProtector>
                    }
                />
                <Route path="*" element={<Navigate to="/books" replace />} />
            </Routes>
            <LoginDialog
                open={openLoginDialog}
                handleSubmit={handleLoginSubmit}
                handleClose={handleLoginClose}
            />
        </>
    )
    
}