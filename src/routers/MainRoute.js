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

function MainRoute() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="add-banner" element={<AddBanner />} />
                <Route path="login" element={<Login />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="order" element={<Order />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="product-details/:id/:slug" element={<ProductDetails />} />
                <Route path="product-list" element={<ProductList />} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Route>
        </Routes>

    )
}

export default MainRoute