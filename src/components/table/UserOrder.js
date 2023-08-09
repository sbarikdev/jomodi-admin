import React from "react";
import { Table, Text, Group, Menu, Button, rem, UnstyledButton, Modal, TextInput, Select } from "@mantine/core";
import axios from "axios";
import { API_URL } from "../../constant";
import { useEffect, useState } from "react";
import { IconEdit, IconEye, IconTrash, IconSearch } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { Checkbox } from "tabler-icons-react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const UserOrder = () => {
    const { id } = useParams();
    const [orderData, setOrderData] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [search, setSearch] = useState("");
    const [filterName, setFilterName] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterBrand, setFilterBrand] = useState("");


    const handleEditModal = (order) => {
        setSelectedOrder(order);
        setOpenEditModal(true);
        setOpenViewModal(false);
    };

    const handleViewModal = (order) => {
        setSelectedOrder(order);
        setOpenViewModal(true);
        setOpenEditModal(false);
    };

    const handleCloseModal = () => {
        setOpenEditModal(false);
        setSelectedOrder(null);
    };

    const handleViewModalClose = () => {
        setOpenViewModal(false);
        setSelectedOrder(null);
    };


    const handleUpdateOrder = () => {
        axios
            .put(`${API_URL}order/order-detail/${selectedOrder.id}/`, selectedOrder)
            .then((res) => {
                console.log(res.data);

                // Update orderData state with the new data received from the server
                setOrderData((prevOrderData) => {
                    // Find the index of the updated order in the orderData array
                    const updatedOrderIndex = prevOrderData.findIndex((order) => order.id === selectedOrder.id);

                    // Create a copy of the orderData array to avoid direct mutation
                    const updatedOrderData = [...prevOrderData];

                    // Replace the old order with the updated order in the copied array
                    updatedOrderData[updatedOrderIndex] = res.data;

                    return updatedOrderData;
                });

                handleCloseModal();

                notifications.show({
                    title: "Status",
                    message: "Status Updated",
                    color: "white",
                    styles: (theme) => ({
                        root: {
                            backgroundColor: theme.colors.teal[0],
                            borderColor: theme.colors.teal[6],
                            '&::before': { backgroundColor: theme.white },
                        },

                    }),
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleOrderDelete = (id) => {
        axios
            .delete(`${API_URL}order/order-detail/${id}/`)
            .then((res) => {
                console.log(res.data);
                notifications.show({
                    title: "Order Deleted",
                    message: "Order Deleted Successfully",
                    color: "white",
                    styles: (theme) => ({
                        root: {
                            backgroundColor: theme.colors.red[0],
                            borderColor: theme.colors.red[6],
                            '&::before': { backgroundColor: theme.white },
                        },
                    }),
                });
                setOrderData((prevOrderData) => {
                    return prevOrderData.filter((order) => order.id !== id);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const filterData = orderData.filter((item) => {
        // Extract the category and brand IDs from the products array
        const productCategories = item.products.map((pro) => pro.category.id);
        const productBrands = item.products.map((pro) => pro.brand.id);

        // Check if filterCategory and filterBrand are arrays
        const isFilterCategoryArray = Array.isArray(filterCategory);
        const isFilterBrandArray = Array.isArray(filterBrand);

        // Check if any of the product categories or brands match the selected filter arrays
        const categoryMatch = isFilterCategoryArray && filterCategory.some((catId) => productCategories.includes(catId));
        const brandMatch = isFilterBrandArray && filterBrand.some((brandId) => productBrands.includes(brandId));
        const nameMatch = item.first_name.toLowerCase().includes(filterName.toLowerCase());
        const idMatch = item.order_id.toLowerCase().includes(filterName.toLowerCase());
        // Return true if any of the filter criteria match, otherwise false
        return categoryMatch || brandMatch || nameMatch || idMatch;
    });



    const filterOrderData = filterData?.length ? filterData : orderData;

    useEffect(() => {
        axios
            .get(`${API_URL}order/order-fetch/?user_id=${id}`)
            .then((res) => {
                console.log(res.data.results);
                setOrderData(res.data.results);

            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);

    



    return (
        <Table striped style={{
            backgroundColor: 'white',
        }}>
            <Modal opened={openEditModal} onClose={handleCloseModal} title="Edit Order" p={30}>
                <Select
                    data={[
                        { value: "Shipping In Progress", label: "Shipping In Progress" },
                        { value: "Shipped", label: "Shipped" },
                        { value: "Out for Delivery", label: "Out For Delivery" },
                        { value: "Delivered", label: "Delivered" },
                        { value: "Cancelled", label: "Cancelled" },
                        { value: 'Cancel Requested', label: 'Cancel Requested' }
                    ]}
                    label="Status"
                    placeholder="Status"
                    value={selectedOrder?.status}
                    onChange={(e) => setSelectedOrder({
                        ...selectedOrder,
                        status: e, // Update the status value in the selectedOrder object
                        cancel: e == "Cancelled" ? true : false // Set the cancel property based on the selected value
                    })}
                />

                <br />
                <Text size="sm" weight={500}>
                    Paid
                </Text>
                <input type="checkbox" checked={selectedOrder?.paid} onChange={(e) => setSelectedOrder({ ...selectedOrder, paid: e.target.checked })} />

                <Group position="right">
                    <Button onClick={handleUpdateOrder}
                        style={{ marginTop: rem(150) }}
                    >
                        Update
                    </Button>
                </Group>
            </Modal>

            <Modal size="70%" opened={openViewModal} onClose={handleViewModalClose} title="View Order Detail" p={30}>
                {/* Modal content */}
                <Group position="apart">
                    <Text size="sm" weight={500}>
                        ID: {selectedOrder?.id}
                    </Text>
                    <Text size="sm" weight={500}>
                        Order Date: {dayjs(selectedOrder?.order_date).format("DD-MMMM-YYYY--MM:HH")}
                    </Text>
                </Group>
                <br />
                <Group position="apart">
                    <Text size="sm" weight={500}>
                        Order ID: {selectedOrder?.order_id}
                    </Text>
                    <Text size="sm" weight={500}>
                        Total: {selectedOrder?.total}
                    </Text>
                </Group>
                <br />
                <Group position="apart">
                    <Text size="sm" weight={500}>
                        Name: {selectedOrder?.first_name} {selectedOrder?.last_name}
                    </Text>
                    <Text size="sm" weight={500}>
                        Phone: {selectedOrder?.phone}
                    </Text>
                </Group>
                <br />
                <Group position="apart">
                    <Text size="sm" weight={500}>
                        Address: {selectedOrder?.address}
                    </Text>
                    <Text size="sm" weight={500}>
                        Email: {selectedOrder?.email}
                    </Text>
                </Group>
                <br />
                <Group position="apart">
                    <Text size="sm" weight={500}>
                        Total Price: {selectedOrder?.total}
                    </Text>
                    <Text size="sm" weight={500}>
                        Payment Method: {selectedOrder?.payment_method}
                    </Text>
                </Group>
                <br />
                <Group position="apart">
                    <Text size="sm" weight={500}>
                        Status: {selectedOrder?.status}
                    </Text>

                    <Text size="sm" weight={500}>
                        Cancel: {selectedOrder?.cancel ? "Yes" : "No"}
                    </Text>
                </Group>
                <br />
                <Group position="apart">
                    <Text size="sm" weight={500}>
                        Products:
                    </Text>
                </Group>
                <br />
                <TextInput placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                <Table striped>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Cancel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedOrder?.products.map((product, index) => (
                            <tr key={product.id}>
                                <td>{index + 1}</td>
                                <td><img src={product.image} alt="" width="50px" /></td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.quantity}</td>
                                <td>{product.cancel ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>

                </Table>


            </Modal>

            <thead>
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Products</th>
                    <th>Total Price</th>
                    <th>
                        Status
                    </th>
                    <th>Paid</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {orderData?.map((order, index) => (
                    <tr key={order.id}>
                        <td>{index + 1}</td>
                        <td>{dayjs(order.order_date).format("DD-MMMM-YYYY")}</td>
                        <td>{order.first_name} {order.last_naem}</td>
                        <td>{order.user.username}</td>
                        <td>{order.address}</td>
                        <td>
                            {
                                order.products.map((item) => (
                                    <Group position="apart">
                                        <Text
                                            color={item.cancel ? "red" : "black"}
                                        >{item.name} x {item.quantity} </Text>
                                        {/* <Text size="sm" weight={400} color="red">
                                            {item.cancel && "Cancel"}
                                        </Text> */}
                                    </Group>
                                ))

                            }
                        </td>
                        <td>{order.total}</td>
                        <td>
                            <Text size="sm" weight={300} color="red">
                                {order.status}
                            </Text>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                checked={order.paid}
                            />
                        </td>
                        <td>
                            <Group>
                                <IconEdit onClick={() => handleEditModal(order)} size={24} />
                                <Menu shadow="md" width={200}>
                                    <Menu.Target>
                                        <IconTrash size={24} />
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>Delete this Order</Menu.Label>
                                        <Group>
                                            <Menu.Item
                                                onClick={() => handleOrderDelete(order.id)}
                                            >Yes</Menu.Item>
                                            <Menu.Item>No</Menu.Item>
                                        </Group>
                                    </Menu.Dropdown>
                                </Menu>

                                <IconEye onClick={() => handleViewModal(order)} size={24} />
                            </Group>


                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default UserOrder;
