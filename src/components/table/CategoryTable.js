import React from "react";
import { Table, Text, Group, Menu, Button, rem, UnstyledButton, Modal, TextInput } from "@mantine/core";
import axios from "axios";
import { API_URL } from "../../constant";
import { useEffect, useState } from "react";
import { IconEdit, IconEye, IconTrash, IconSearch } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { Checkbox } from "tabler-icons-react";
import dayjs from "dayjs";


const CategoryTable = () => {

    const [categoryData, setCategoryData] = useState([]);
    const [selectCategory, setSelectCategory] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);

    const handleEditModal = (category) => {
        setSelectCategory(category);
        setEditModalOpen(true);
    };

    const handleViewModal = (category) => {
        setSelectCategory(category);
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
            .delete(`${API_URL}category/category/${id}/`)
            .then((res) => {
                console.log(res.data);
                notifications.show({
                    title: "Category Deleted",
                    message: "Category Deleted Successfully",
                    color: "red",
                    autoClose: 5000,
                });
                setCategoryData((prevCategoryData) => {
                    return prevCategoryData.filter((category) => category.id !== id);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleCategoryUpdate = (id) => {
        axios
            .put(`${API_URL}category/category/${id}/`, {
                name: selectCategory.name,
            })
            .then((res) => {
                console.log(res.data);
                notifications.show({
                    title: "Category Updated",
                    message: "Category Updated Successfully",
                    color: "blue",
                    autoClose: 5000,
                });
                setCategoryData((prevCategoryData) => {
                    return prevCategoryData.map((category) => {
                        if (category.id === id) {
                            return res.data;
                        }
                        return category;
                    });
                });
                setEditModalOpen(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };




    useEffect(() => {
        axios
            .get(`${API_URL}category/category/`)
            .then((res) => {
                console.log(res.data.results);
                setCategoryData(res.data.results);


            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    return (
        <Table striped>
            <Modal opened={editModalOpen} onClose={handleEditModalClose} size="md">
                <Modal.Header>Update Category</Modal.Header>
                <Modal.Body>
                    <TextInput

                        label="Category Name"
                        placeholder="Enter Category Name"
                        value={selectCategory?.name}
                        onChange={(e) => {
                            setSelectCategory({ ...selectCategory, name: e.target.value });
                        }}
                    />
                </Modal.Body>

                <Button m="xl" onClick={handleEditModalClose}>Cancel</Button>
                <Button m="xl" color="blue" onClick={() => handleCategoryUpdate(selectCategory.id)} >
                    Update
                </Button>

            </Modal>

            <Modal opened={viewModalOpen} onClose={handleViewModalClose} size="md">
                <Modal.Header>View Category</Modal.Header>
                <Modal.Body>
                    <Group>
                        <Text weight={500}>Category Name:</Text>
                        <Text>{selectCategory?.name}</Text>
                    </Group>
                    <Group>
                        <Text weight={500}>Description:</Text>
                        <Text>{selectCategory?.description}</Text>
                    </Group>
                    {
                        selectCategory?.image && (
                            <img src={selectCategory?.image} alt={selectCategory?.name} 
                            style={{
                                width: "200px",
                                height: "200px",
                                margin: "auto",
                            }}
                            />
                        )
                    }

                </Modal.Body>
                </Modal>


            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Action</th>
                    <th>Date Created</th>
                </tr>
            </thead>
            <tbody>
                {categoryData.map((category, index) => (
                    <tr key={category.id}>
                        <td>{index + 1}</td>
                        <td>{category.name}</td>
                        <td>
                            <Group>
                                <IconEdit onClick={() => handleEditModal(category)} size={24} />
                                <Menu shadow="md" width={200}>
                                    <Menu.Target>
                                        <IconTrash size={24} />
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>Delete this Category</Menu.Label>
                                        <Group>
                                            <Menu.Item
                                                onClick={() => handleCategoryDelete(category.id)}
                                            >Yes</Menu.Item>
                                            <Menu.Item>No</Menu.Item>
                                        </Group>
                                    </Menu.Dropdown>
                                </Menu>

                                <IconEye onClick={() => handleViewModal(category)} size={24} />
                            </Group>

                        </td>
                        <td>{dayjs(category.created_at).format("DD/MM/YYYY")}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default CategoryTable;
