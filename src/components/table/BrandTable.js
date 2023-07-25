import React from "react";
import { Table, Text, Group, Menu, Button, rem, UnstyledButton, Modal, TextInput, MultiSelect } from "@mantine/core";
import axios from "axios";
import { API_URL } from "../../constant";
import { useEffect, useState } from "react";
import { IconEdit, IconEye, IconTrash, IconSearch } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { Checkbox } from "tabler-icons-react";
import dayjs from "dayjs";


const BrandTable = () => {

    const [brandData, setBrandData] = useState([]);
    const [selectBrand, setSelectBrand] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [filterName, setFilterName] = useState("");
    const [filterCategory, setFilterCategory] = useState([]);

    const handleEditModal = (brand) => {
        setSelectBrand(brand);
        setEditModalOpen(true);
    };

    const handleViewModal = (brand) => {
        setSelectBrand(brand);
        setViewModalOpen(true);

    };

    const handleEditModalClose = () => {
        setEditModalOpen(false);
    };

    const handleViewModalClose = () => {
        setViewModalOpen(false);
    };

    const handleBrandDelete = (id) => {
        axios
            .delete(`${API_URL}category/brand/${id}/`)
            .then((res) => {
                console.log(res.data);
                notifications.show({
                    title: "Brand Deleted",
                    message: "Brand Deleted Successfully",
                    color: "red",
                    autoClose: 5000,
                });
                setBrandData((prevBrandData) => {
                    return prevBrandData.filter((brand) => brand.id !== id);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleBrandUpdate = (id) => {
        axios
            .put(`${API_URL}category/brand/${id}/`, {
                name: selectBrand.name,
                category: selectBrand.category,
            })
            .then((res) => {
                console.log(res.data);
                notifications.show({
                    title: "Brand Updated",
                    message: "Brand Updated Successfully",
                    color: "blue",
                    autoClose: 5000,
                });
                setBrandData((prevBrandData) => {
                    return prevBrandData.map((brand) => {
                        if (brand.id === id) {
                            return res.data;
                        }
                        return brand;
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
            .get(`${API_URL}category/brand/`)
            .then((res) => {
                console.log(res.data.results);
                setBrandData(res.data.results);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    const handleFilter = () => {
        console.log(filterCategory);
    }
    const uniqueCategoryIds = new Set();

    const allCategoryList = brandData.reduce((acc, brand) => {
        // Check if the category ID is already present in the Set
        if (!uniqueCategoryIds.has(brand.category.id)) {
            // Add the category ID to the Set
            uniqueCategoryIds.add(brand.category.id);
            // Push the category object into the accumulator array
            acc.push({
                label: brand.category.name,
                value: brand.category.id,
            });
        }
        return acc;
    }, []);

    const filterData = brandData.filter((item) => {
        // Check if filterCategory is an array and includes the category ID
        const categoryMatch = Array.isArray(filterCategory) && filterCategory.includes(item.category.id);

        // Check if filterName exists and matches the brand name or category name (case-insensitive)
        const nameMatch = filterName && (
            item.name.toLowerCase().includes(filterName.toLowerCase()) ||
            (item.category && item.category.name.toLowerCase().includes(filterName.toLowerCase()))
        );

        // Return true if any of the filter criteria match, otherwise false
        return categoryMatch || nameMatch;
    });



    const filteredData = filterData.length ? filterData : brandData;

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <TextInput
                    label="Name"
                    value={filterName}
                    onChange={(event) => setFilterName(event.currentTarget.value)}
                    placeholder="Enter name..."
                />
                <MultiSelect
                    label="Category"
                    placeholder="Select category"
                    value={filterCategory}
                    onChange={(value) => setFilterCategory(value)}
                    data={allCategoryList}
                />
            </div>
        <Table striped>
            <Modal opened={editModalOpen} onClose={handleEditModalClose} size="md">
                <Modal.Header>Update Brand</Modal.Header>
                <Modal.Body>
                    <TextInput

                        label="Brand Name"
                        placeholder="Enter Brand Name"
                        value={selectBrand?.name}
                        onChange={(e) =>
                            setSelectBrand((prevBrand) => {
                                return { ...prevBrand, name: e.target.value };
                            })
                        }
                    />
                </Modal.Body>
                <Button onClick={() => handleBrandUpdate(selectBrand.id)}>Update</Button>
            </Modal>

            <Modal opened={viewModalOpen} onClose={handleViewModalClose} size="md">
                <Modal.Header>View Brand</Modal.Header>
                <Modal.Body>
                    <Text weight={500}>Brand Name</Text>
                    <Text>{selectBrand?.name}</Text>
                    <Text weight={500}>Category Name</Text>
                    <Text>{selectBrand?.category?.name}</Text>
                    
                </Modal.Body>
            </Modal>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>
                        Category
                    </th>
                    <th>Action</th>
                    <th>Date Created</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map((brand, index) => (
                    <tr key={brand.id}>
                        <td>{index + 1}</td>
                        <td>{brand.name}</td>
                        <td>{brand.category.name}</td>
                        <td>
                            <Group>
                                <IconEdit onClick={() => handleEditModal(brand)} size={24} />
                                <Menu shadow="md" width={200}>
                                    <Menu.Target>
                                        <IconTrash size={24} />
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>Delete this Brand</Menu.Label>
                                        <Group>
                                            <Menu.Item
                                                onClick={() => handleBrandDelete(brand.id)}
                                            >Yes</Menu.Item>
                                            <Menu.Item>No</Menu.Item>
                                        </Group>
                                    </Menu.Dropdown>
                                </Menu>

                                <IconEye onClick={() => handleViewModal(brand)} size={24} />
                            </Group>

                        </td>
                        <td>{dayjs(brand.created_at).format("DD/MM/YYYY")}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </div>
    );
};

export default BrandTable;
