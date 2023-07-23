import React from "react";
import { Table, Text } from "@mantine/core";
import axios from "axios";
import { API_URL } from "../../constant";
import { useEffect, useState } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";


const ProductTable = () => {
    const [productData, setProductData] = useState([]);

    useEffect(() => {
        axios
            .get(`${API_URL}product/product_detail/`)
            .then((res) => {
                console.log(res.data.results);
                setProductData(res.data.results);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <Table striped>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>In Stock</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {productData.map((product) => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.category.name}</td>
                        <td>{product.brand.name}</td>
                        <td>{product.inStock ? "Yes" : "No"}</td>
                        <td>
                            <IconEdit size={24} />
                            <IconTrash size={24} />

                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default ProductTable;
