import React from "react";
import { Table, Text, Group, Menu, Button, rem, UnstyledButton, Modal, TextInput, Pagination, Loader } from "@mantine/core";
import axios from "axios";
import { API_URL } from "../../constant";
import { useEffect, useState } from "react";
import { IconEdit, IconEye, IconTrash, IconSearch } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { Checkbox } from "tabler-icons-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [orderData, setOrderData] = useState([]);
    const [filterName, setFilterName] = useState("");
    const [checked, setChecked] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false)


    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEmail("");
        setPhone("");
        setFullName("");
        setPassword("");
        setConfirmPassword("");

    };

    useEffect(() => {
        axios
            .get(`${API_URL}order/order/`)
            .then((res) => {
                console.log(res.data.results);
                setOrderData(res.data.results);

            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    useEffect(() => {
        axios
            .get(`${API_URL}auth/profile`)
            .then((res) => {
                console.log(res.data.results);
                setProfileData(res.data.results);

            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const filterData = profileData.filter((item) => {
        // Check if filterCategory is an array and includes the category ID

        // Check if filterName exists and matches the brand name or category name (case-insensitive)
        const nameMatch = filterName && (
            item?.first_name?.toLowerCase().includes(filterName.toLowerCase()) || item?.user?.username.toLowerCase().includes(filterName.toLowerCase())
            || item?.last_name?.toLowerCase().includes(filterName.toLowerCase()) || item?.address?.toLowerCase().includes(filterName.toLowerCase())
        );

        // Return true if any of the filter criteria match, otherwise false
        return nameMatch;
    });

    const handleUserDelete = (id, userId) => {
        axios.delete(`${API_URL}auth/profile/${id}`)
        axios
            .delete(`${API_URL}auth/user/${userId}`)
            .then((res) => {
                console.log(res.data);
                notifications.show({
                    title: 'User Deleted',
                    message: 'User Deleted Successfully',
                    color: 'green',
                    autoClose: 5000,
                });
                setProfileData((prevProfileData) => {
                    return prevProfileData.filter((profileItem) => profileItem.id !== id);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const handleSubmit = () => {
        setSubmitting(true)
        axios.post(`${API_URL}auth/register`, {
            email: email,
            username: phone,
            first_name: fullName,
            password: password,
            active: true,
            admin: true,
        })
            .then((res) => {
                console.log(res);
                notifications.show({
                    title: 'Admin Added',
                    message: 'User Added Successfully',
                    color: 'green',
                    autoClose: 5000,
                });
                setProfileData((prevProfileData) => {
                    return [...prevProfileData, res.data]; // Add the new user to the existing array
                });
                setSubmitting(false)
                setOpenModal(false)
            })
            .catch((err) => {
                console.log(err);
                setSubmitting(false)
                notifications.show({
                    title: 'Something went wrong',
                    message: 'Something went wrong',
                    color: 'red',
                    autoClose: 5000,
                });
            });
    }

    const filteredData = filterData.length ? filterData : profileData;

    const [page, setPage] = useState(1);

    const itemsPerPage = 10;

    const totalPages = Math.ceil(filteredData?.length / itemsPerPage)


    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const paginatedItems = (
        filteredData?.slice(
            (page - 1) * itemsPerPage,
            page * itemsPerPage)
    )


    const passwordMatch = password != confirmPassword

    return (
        <div
            style={{
                backgroundColor: 'white',
            }}
        >
            <h3
                style={{
                    textAlign: 'center',
                    justifyContent: 'center',
                }}
            >
                User Table
            </h3>

            <Group position="apart">
                <TextInput
                    label="Name"
                    value={filterName}
                    onChange={(event) => setFilterName(event.currentTarget.value)}
                    placeholder="Enter name..."
                />

                <Button onClick={handleOpenModal}

                >
                    Add New Admin
                </Button>
            </Group>

            <Modal opened={openModal} onClose={() => setOpenModal(false)}>
                <h3 style={{
                    textAlign: 'center',
                }}
                >
                    Add New
                </h3>

                <Modal.Body>
                    {
                        submitting && (
                            <Loader variant="bars" size="xl" />
                        )
                    }
                    <TextInput
                        label="Name"
                        placeholder="Enter name..."
                        value={fullName}
                        onChange={(event) => setFullName(event.currentTarget.value)}
                    />
                    <TextInput
                        label="Email"
                        placeholder="Enter email..."
                        value={email}
                        onChange={(event) => setEmail(event.currentTarget.value)}
                    />

                    <TextInput
                        label="Phone / Username"
                        placeholder="Enter phone..."
                        value={phone}
                        onChange={(event) => setPhone(event.currentTarget.value)}
                    />

                    <TextInput
                        label="Password"
                        placeholder="Enter password..."
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                    />

                    <TextInput
                        label="Confirm Password"
                        type="password"
                        placeholder="Enter confirm password..."
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.currentTarget.value)}
                    />

                    {
                        password !== confirmPassword && (
                            <Text color="red">
                                Password and Confirm Password does not match
                            </Text>
                        )
                    }
                </Modal.Body>

                <Button onClick={handleSubmit} fullWidth
                    disabled={
                        passwordMatch
                    }
                    loading={submitting}
                >Add User</Button>

            </Modal>


            <Table striped>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Date of Birth</th>
                        <th>
                            Number of Order
                        </th>
                        <th>
                            Number of Cancel Order
                        </th>
                        <th>
                            Date Joined
                        </th>
                        <th>
                            Active
                        </th>
                        <th>
                            Delete
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedItems?.map((profile, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{profile?.user?.first_name || "Not Added"} {profile?.last_name}</td>
                            <td>{profile?.user?.username || "Not Added"} </td>
                            <td>{profile.address || "Not Added"}</td>
                            <td>
                                {profile.date_of_birth || "Not Added"}
                            </td>

                            <td>
                                <UnstyledButton
                                    onClick={() => navigate(`/user-order/${profile?.user?.id}`)}
                                >

                                    <Text size="sm" weight={500} color="red">
                                        {
                                            orderData.filter((order) => order.user == profile?.user?.id).length
                                        }
                                    </Text>
                                </UnstyledButton>

                            </td>
                            <td>
                                <UnstyledButton
                                    onClick={() => navigate(`/user-order/${profile?.user?.id}`)}
                                >

                                    <Text size="sm" weight={500} color="red">
                                        {
                                            orderData.filter((order) => (order.user == profile?.user?.id) && (order.cancel)).length
                                        }
                                    </Text>
                                </UnstyledButton>

                            </td>
                            <td>
                                {dayjs(profile.created_at).format("DD/MM/YYYY")}
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={profile?.user?.active}
                                    onChange={(e) => {
                                        const updatedIsActive = e.target.checked; // Get the updated is_active value
                                        axios
                                            .patch(`${API_URL}auth/user/${profile?.user?.id}`, {
                                                active: updatedIsActive, // Use the updated value here
                                            })
                                            .then((res) => {
                                                console.log(res.data);
                                                notifications.show({
                                                    title: 'User Updated',
                                                    message: 'User Updated Successfully',
                                                    color: 'green',
                                                    autoClose: 5000,
                                                });
                                                setProfileData((prevProfileData) => {
                                                    return prevProfileData.map((profileItem) => {
                                                        if (profileItem.id === profile.id) {
                                                            return {
                                                                ...profileItem,
                                                                user: {
                                                                    ...profileItem.user,
                                                                    active: updatedIsActive, // Use the updated value here
                                                                },
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
                            <td>

                                <Menu shadow="md" width={200}>
                                    <Menu.Target>
                                        <IconTrash size={24} />
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>Delete this User</Menu.Label>
                                        <Group>
                                            <Menu.Item
                                                onClick={() => handleUserDelete(profile?.id, profile?.user?.id)}
                                            >
                                                Yes
                                            </Menu.Item>
                                            <Menu.Item>No</Menu.Item>
                                        </Group>
                                    </Menu.Dropdown>
                                </Menu>
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

export default UserProfile;
