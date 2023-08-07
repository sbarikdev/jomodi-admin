import React from "react";
import { Table, Text, Group, Menu, Button, rem, UnstyledButton, Modal, TextInput, Pagination, Checkbox, Paper } from "@mantine/core";
import axios from "axios";
import { API_URL } from "../../constant";
import { useEffect, useState } from "react";
import { IconEdit, IconEye, IconTrash, IconSearch } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { DateInput } from "@mantine/dates";


const CouponTable = () => {
    const [couponData, setCouponData] = useState([]);
    const [selectCoupon, setSelectCoupon] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);


    const handleEditModal = (coupon) => {
        setSelectCoupon(coupon);
        setEditModalOpen(true);
    };

    const handleViewModal = (coupon) => {
        setSelectCoupon(coupon);
        setViewModalOpen(true);
    };

    const handleEditModalClose = () => {
        setEditModalOpen(false);
    };

    const handleViewModalClose = () => {
        setViewModalOpen(false);
    };

    const handleCategoryDelete = (id) => {
        axios
            .delete(`${API_URL}order/coupon-admin/${id}/`)
            .then((res) => {
                console.log(res.data);
                notifications.show({
                    title: "Category Deleted",
                    message: "Category Deleted Successfully",
                    color: "red",
                    autoClose: 5000,
                });
                setCouponData((prevCategoryData) => {
                    return prevCategoryData.filter((coupon) => coupon.id !== id);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const isFile = (input) => "File" in window && input instanceof File;

    const handleCategoryUpdate = (id) => {
        const formData = new FormData();
        const formattedEndDate = formatISODate(selectCoupon?.end_date);
        if (formattedEndDate !== null) {
            formData.append('end_date', formattedEndDate);
        }

        const formattedStartDate = formatISODate(selectCoupon?.start_date);
        if (formattedStartDate !== null) {
            formData.append('start_date', formattedStartDate);
        }
        formData.append('title', selectCoupon?.title);
        formData.append('description', selectCoupon?.description);
        formData.append('code', selectCoupon?.code);
        formData.append('discount', selectCoupon?.discount);
        formData.append('number_available', selectCoupon?.number_available);
        formData.append('active', selectCoupon?.active);
        isFile(selectCoupon?.image) && formData.append('image', selectCoupon?.image);

        axios
            .patch(`${API_URL}order/coupon-admin/${id}/`, formData)
            .then((res) => {
                console.log(res.data);
                notifications.show({
                    title: "Category Updated",
                    message: "Category Updated Successfully",
                    color: "blue",
                    autoClose: 5000,
                });
                setCouponData((prevCategoryData) => {
                    return prevCategoryData.map((coupon) => {
                        if (coupon.id === id) {
                            return res.data;
                        }
                        return coupon;
                    });
                });
                setEditModalOpen(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [page, setPage] = useState(1);

    const itemsPerPage = 10;

    const totalPages = Math.ceil(couponData?.length / itemsPerPage)


    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const paginatedItems = (
        couponData?.slice(
            (page - 1) * itemsPerPage,
            page * itemsPerPage)
    )

    const formatISODate = (date) => {
        if (date instanceof Date) {
            return date.toISOString();
        }
        return null; // Or any other value that indicates the date is invalid
    };

    useEffect(() => {
        axios
            .get(`${API_URL}order/coupon-admin/`)
            .then((res) => {
                console.log(res.data.results);
                setCouponData(res.data.results);


            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    return (
        <div>
            <h3
                style={{
                    textAlign: 'center',
                    justifyContent: 'center',
                }}
            >
                Coupon Table
            </h3>
            <Table striped style={{
                backgroundColor: 'white',
            }}>
                <Modal opened={editModalOpen} onClose={handleEditModalClose} size="md">
                    <Modal.Header>Update Coupon</Modal.Header>
                    <Modal.Body>
                        <TextInput
                            value={selectCoupon?.title}
                            onChange={(e) => setSelectCoupon({ ...selectCoupon, title: e.target.value })}
                            label="Coupon Title"
                            placeholder="Coupon Title"
                            required
                        />
                        <TextInput

                            value={selectCoupon?.code}
                            onChange={(e) => setSelectCoupon({ ...selectCoupon, code: e.target.value })}
                            label="Coupon Code"
                            placeholder="Coupon Code"
                            required
                        />
                        <TextInput
                            value={selectCoupon?.description}
                            onChange={(e) => setSelectCoupon({ ...selectCoupon, description: e.target.value })}
                            label="Description"
                            placeholder="Description"
                        />
                        <TextInput
                            value={selectCoupon?.discount}
                            onChange={(e) => setSelectCoupon({ ...selectCoupon, discount: e.target.value })}
                            label="Discount"
                            placeholder="Discount"
                        />
                        <TextInput
                            value={selectCoupon?.number_available}
                            onChange={(e) => setSelectCoupon({ ...selectCoupon, number_available: e.target.value })}
                            label="Number Available"
                            placeholder="Number Available"
                        />
                        <DateInput
                            value={new Date(selectCoupon?.start_date)}
                            onChange={(e) => setSelectCoupon({ ...selectCoupon, start_date: e })}
                            label="Start Date"
                            placeholder="Start Date"
                        />
                        <DateInput
                            value={new Date(selectCoupon?.end_date)}
                            onChange={(e) => setSelectCoupon({ ...selectCoupon, end_date: e })}
                            label="Expiry Date"
                            placeholder="Expiry Date"
                        />
                        <Checkbox
                            my="xl"
                            checked={selectCoupon?.active}
                            onChange={(e) => setSelectCoupon({ ...selectCoupon, active: e.target.checked })}
                            label="Active"
                            placeholder="Active"
                        />


                    </Modal.Body>

                    <Button m="xl" onClick={handleEditModalClose}>Cancel</Button>
                    <Button m="xl" color="blue" onClick={() => handleCategoryUpdate(selectCoupon.id)} >
                        Update
                    </Button>

                </Modal>

                <Modal opened={viewModalOpen} onClose={handleViewModalClose} size="md">
                    <Paper padding="md">
                        <Text size="lg" weight={600}>
                            Coupon Title: {selectCoupon?.title}
                        </Text>
                        <Text size="lg" weight={600}>
                            Coupon Code: {selectCoupon?.code}
                        </Text>
                        <Text size="sm" color="gray"
                            style={{
                                whiteSpace: 'pre-wrap'
                            }}
                        >
                            Description: {selectCoupon?.description}
                        </Text>
                        <Text size="sm" color="gray">
                            Discount: {selectCoupon?.discount}
                        </Text>
                        <Text size="sm" color="gray">
                            Number Available: {selectCoupon?.number_available}
                        </Text>
                        <Text size="sm" color="gray">
                            Start Date: {dayjs(selectCoupon?.start_date).format("DD/MM/YYYY")}
                        </Text>
                        <Text size="sm" color="gray">
                            Expiry Date: {dayjs(selectCoupon?.end_date).format("DD/MM/YYYY")}
                        </Text>
                        <Text size="sm" color="gray">
                            Active: {selectCoupon?.active ? "Yes" : "No"}
                        </Text>
                        <Text size="sm" color="gray">
                            Date Created: {dayjs(selectCoupon?.created_at).format("DD/MM/YYYY")}
                        </Text>

                    </Paper>
                    {
                        selectCoupon?.image && (
                            <img src={selectCoupon?.image} alt={selectCoupon?.name}
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    margin: "auto",
                                }}
                            />
                        )
                    }
                    <Button variant="outline" onClick={handleEditModalClose} style={{ marginTop: '1rem' }}>
                        Close
                    </Button>
                </Modal>


                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Code</th>
                        <th>Discount</th>
                        <th>Number Available</th>
                        <th>Start Date</th>
                        <th>Expiry Date</th>
                        <th>Active</th>
                        <th>Date Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedItems?.map((coupon, index) => (
                        <tr key={coupon.id}>
                            <td>{index + 1}</td>
                            <td>{coupon.title}</td>
                            <td>{coupon.code}</td>
                            <td>{coupon.discount}</td>
                            <td>{coupon.number_available}</td>
                            <td>{dayjs(coupon.start_date).format("DD/MM/YYYY")}</td>
                            <td>{dayjs(coupon.end_date).format("DD/MM/YYYY")}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={coupon?.active}
                                    onChange={(e) => {
                                        const updatedIsActive = e.target.checked; // Get the updated is_active value
                                        axios
                                            .patch(`${API_URL}order/coupon-admin/${coupon?.id}/`, {
                                                active: updatedIsActive, // Use the updated value here
                                            })
                                            .then((res) => {
                                                console.log(res.data);
                                                notifications.show({
                                                    title: 'Coupon Updated',
                                                    message: 'Coupon Updated Successfully',
                                                    color: 'green',
                                                    autoClose: 5000,
                                                });
                                                setCouponData((prevCouponData) => {
                                                    return prevCouponData.map((profileItem) => {
                                                        if (profileItem.id === coupon.id) {
                                                            return {
                                                                ...profileItem,
                                                                active: updatedIsActive, // Use the updated value here
                                                            };
                                                        }
                                                        return profileItem;
                                                    });
                                                });
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            });
                                    }}
                                />
                            </td>
                            <td>{dayjs(coupon.created_at).format("DD/MM/YYYY")}</td>
                            <td>
                                <Group>
                                    <IconEdit onClick={() => handleEditModal(coupon)} size={24} />
                                    <Menu shadow="md" width={200}>
                                        <Menu.Target>
                                            <IconTrash size={24} />
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Label>Delete this Category</Menu.Label>
                                            <Group>
                                                <Menu.Item
                                                    onClick={() => handleCategoryDelete(coupon.id)}
                                                >Yes</Menu.Item>
                                                <Menu.Item>No</Menu.Item>
                                            </Group>
                                        </Menu.Dropdown>
                                    </Menu>

                                    <IconEye onClick={() => handleViewModal(coupon)} size={24} />
                                </Group>

                            </td>

                        </tr>
                    ))}
                </tbody>
            </Table>
            <Group spacing={5} position="right">
                <Pagination my="lg" total={totalPages}
                    value={page}
                    onChange={handlePageChange} color="red"
                    style={{
                        display: 'flex',
                        fontSize: '1.6rem',
                    }}
                />
            </Group>
        </div>
    );
};

export default CouponTable;
