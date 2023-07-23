import React from "react";
import { Table, Text } from "@mantine/core";
import axios from "axios";
import { API_URL } from "../../constant";
import { useEffect, useState } from "react";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";


const OrderTable = () => {

    const [orderData, setOrderData] = useState([]);

    useEffect(() => {
        axios
            .get(`${API_URL}order/order-detail/`)
            .then((res) => {
                console.log(res.data.results);
                setOrderData(res.data.results);
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
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Products</th>
                    <th>Total Price</th>
                    <th>
                        Status
                    </th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {orderData.map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.first_name} {order.last_naem}</td>
                        <td>{order.user.username}</td>
                        <td>{order.address}</td>
                        <td>
                            {
                                order.products.map((item) => (
                                    <p>{item.name} x {item.quantity}</p>
                                ))

                            }
                        </td>
                        <td>{order.total}</td>
                        <td>{
                            order.status
                        }</td>
                        <td>
                            <IconEdit size={24} />
                            <IconTrash size={24} />
                            <IconEye size={24} />

                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default OrderTable;
