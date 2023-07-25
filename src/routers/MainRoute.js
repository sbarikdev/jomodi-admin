import React from 'react'
import { Route, Routes } from "react-router-dom";
import AppLayout from '../layout/AppLayout'
import Dashboard from '../components/dashboard/Dashboard';
import AddBanner from '../components/banner/AddBanner';
import Login from '../components/auth/Login';
import ResetPassword from '../components/auth/ResetPassword';
import Order from '../components/order/Order';
import AddProduct from '../components/addProduct/AddProduct';
import ProductDetails from '../components/product/ProductDetails';
import ProductList from '../components/product/ProductList';
import AddCategory from '../components/addProduct/AddCategory';
import AddBrand from '../components/addProduct/AddBrand';
import ProductTable from '../components/table/ProductTable';
import CategoryTable from '../components/table/CategoryTable';
import BrandTable from '../components/table/BrandTable';
import OrderTable from '../components/table/OrderTable';
import UserProfile from '../components/table/UserProfile';
import NewsLetter from '../components/table/NewsLetter';
import UserOrder from '../components/table/UserOrder';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../context/auth-context';

function MainRoute() {
    const isAuthenticated = localStorage.getItem('admin');
    const wrapPrivateRoute = (element, user) => {
        return (
            <PrivateRoute user={user}>
                {element}
            </PrivateRoute>
        );
    };


    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={wrapPrivateRoute(<Dashboard />, isAuthenticated)} />
                <Route path="dashboard" element={wrapPrivateRoute(<Dashboard />, isAuthenticated)} />
                <Route path="add-banner" element={wrapPrivateRoute(<AddBanner />, isAuthenticated)} />
                <Route path="reset-password" element={wrapPrivateRoute(<ResetPassword />, isAuthenticated)} />
                <Route path="order" element={wrapPrivateRoute(<Order />, isAuthenticated)} />
                <Route path="add-product" element={wrapPrivateRoute(<AddProduct />, isAuthenticated)} />
                <Route path="product-details/:id/:slug" element={wrapPrivateRoute(<ProductDetails />, isAuthenticated)} />
                <Route path="product-list" element={wrapPrivateRoute(<ProductList />, isAuthenticated)} />
                <Route path="add-category" element={wrapPrivateRoute(<AddCategory />, isAuthenticated)} />
                <Route path="add-brand" element={wrapPrivateRoute(<AddBrand />, isAuthenticated)} />
                <Route path="product-table" element={wrapPrivateRoute(<ProductTable />, isAuthenticated)} />
                <Route path="category-table" element={wrapPrivateRoute(<CategoryTable />, isAuthenticated)} />
                <Route path="brand-table" element={wrapPrivateRoute(<BrandTable />, isAuthenticated)} />
                <Route path="order-table" element={wrapPrivateRoute(<OrderTable />, isAuthenticated)} />
                <Route path="user" element={wrapPrivateRoute(<UserProfile />, isAuthenticated)} />
                <Route path="newsletter" element={wrapPrivateRoute(<NewsLetter />, isAuthenticated)} />
                <Route path="user-order/:id" element={wrapPrivateRoute(<UserOrder />, isAuthenticated)} />
                <Route path="*" element={<h1>Not Found</h1>} />
            
            </Route>
            <Route path="/login" element={<Login />} />
        </Routes>

    )
}

export default MainRoute