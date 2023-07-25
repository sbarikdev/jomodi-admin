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
                <Route path="add-category" element={<AddCategory />} />
                <Route path="add-brand" element={<AddBrand />} />
                <Route path="product-table" element={<ProductTable />} />
                <Route path="category-table" element={<CategoryTable />} />
                <Route path="brand-table" element={<BrandTable />} />
                <Route path="order-table" element={<OrderTable />} />
                <Route path="user" element={<UserProfile />} />
                <Route path="newsletter" element={<NewsLetter />} />
                <Route path="user-order/:id" element={<UserOrder />} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Route>
        </Routes>

    )
}

export default MainRoute