import React from "react";
import {
    Table,
    Text,
    Group,
    Menu,
    Button,
    rem,
    UnstyledButton,
    Modal,
    TextInput,
} from "@mantine/core";
import axios from "axios";
import { API_URL } from "../../constant";
import { useEffect, useState } from "react";
import { IconEdit, IconEye, IconTrash, IconSearch } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { Checkbox, Tex } from "tabler-icons-react";
import dayjs from "dayjs";
import {
    Card,
    Col,
    Container,
    Input,
    Grid,
    Textarea,
    FileInput,
    Select,
    NumberInput,
    Image,
} from "@mantine/core";


const ProductTable = () => {
    const [productData, setProductData] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [allCategory, setAllCategory] = useState([]);
    const [allBrand, setAllBrand] = useState([]);
    const [image, setImage] = useState({ base64: "", files: [] });
    const [additionalImages, setAdditionalImages] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios
            .get(`${API_URL}category/category/`)
            .then((res) => {
                console.log(res.data.results);
                setAllCategory(res.data.results);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        axios
            .get(`${API_URL}category/brand/`)
            .then((res) => {
                console.log(res.data.results);
                setAllBrand(res.data.results);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const allCategoryList = allCategory?.map((item) => {
        return {
            value: item.id,
            label: item.name,
        };
    });

    const allBrandList = allBrand?.map((item) => {
        return {
            value: item.id,
            label: item.name,
            category: item.category,
        };
    });

    const handleEditModal = (product) => {
        setSelectedProduct(product);
        setEditModalOpen(true);
    };

    const handleViewModal = (product) => {
        setSelectedProduct(product);
        setViewModalOpen(true);
    };

    const handleEditModalClose = () => {
        setEditModalOpen(false);
        setSelectedProduct(null);
    };

    const handleViewModalClose = () => {
        setViewModalOpen(false);
        setSelectedProduct(null);
    };


    const handleImageChange = (files) => {
        // Function to update the additional images state
        setAdditionalImages(files);
    };
    const handleProductDelete = (id) => {
        axios
            .delete(`${API_URL}product/product_detail/${id}/`)
            .then((res) => {
                console.log(res.data);
                notifications.show({
                    title: "Product Deleted",
                    message: "Product Deleted Successfully",
                    color: "white",
                    styles: (theme) => ({
                        root: {
                            backgroundColor: theme.colors.red[0],
                            borderColor: theme.colors.red[6],
                            "&::before": { backgroundColor: theme.white },
                        },
                    }),
                });
                setProductData((prevProductData) => {
                    return prevProductData.filter((product) => product.id !== id);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleProductEdit = () => {
        if (selectedProduct) {
            axios
                .put(
                    `${API_URL}product/product_detail/${selectedProduct.id}/`,
                    selectedProduct
                )
                .then((res) => {
                    console.log(res.data);

                    // Update productData state with the updated product
                    setProductData((prevProductData) => {
                        const updatedProductData = prevProductData.map((product) =>
                            product.id === selectedProduct.id ? res.data : product
                        );
                        return updatedProductData;
                    });

                    handleEditModalClose();

                    notifications.show({
                        title: "Status",
                        message: "Product Updated",
                        color: "white",
                        styles: (theme) => ({
                            root: {
                                backgroundColor: theme.colors.teal[0],
                                borderColor: theme.colors.teal[6],
                                "&::before": { backgroundColor: theme.white },
                            },
                        }),
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

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

    const handleChange = (name) => {
        return (eventOrValue) => {
            const value = eventOrValue?.target?.checked ?? eventOrValue;

            setSelectedProduct((prevProduct) => ({
                ...prevProduct,
                [name]: value,
            }));
        };
    };

    return (
        <Table striped>
            <Modal
                opened={editModalOpen}
                onClose={handleEditModalClose}
                size="70%"
                padding="md"
            >
                <Modal.Title>Edit Product</Modal.Title>

                <form onSubmit={handleProductEdit} encType="multipart/form-data">
                    <Grid>
                        <Col span={12}>
                            <Select
                                label="Select Category"
                                placeholder="Select Category"
                                data={
                                    allCategoryList
                                }
                                value={selectedProduct?.category?.id}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e })}
                            // value={category || selectedProduct?.category?.id}
                            // onChange={setCategory}
                            />
                        </Col>
                        <Col span={12}>
                            <Select
                                label="Select Brand"
                                placeholder="Select Brand"
                                data={(
                                    allBrandList.filter((item) => (item.category.id == selectedProduct?.category))
                                )
                                }
                                value={selectedProduct?.brand?.id}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, brand: e })}
                            />
                        </Col>
                        <Col span={6}>
                            <NumberInput
                                value={selectedProduct?.price}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e })}
                                label="Price"
                                placeholder="Price"
                                required
                            />
                        </Col>
                        <Col span={6}>
                            <NumberInput
                                value={selectedProduct?.cancel_price}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, cancel_price: e })}
                                label="Cancel Price"
                                placeholder="Cancel Price"
                            />
                        </Col>
                        <Col span={12}>
                            <TextInput
                                value={selectedProduct?.name}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                                label="Product Name"
                                placeholder="Product Name"
                                required
                            />
                        </Col>

                        <Col span={12}>
                            <Textarea
                                value={selectedProduct?.description}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                                label="Description"
                                placeholder="Description"
                            />
                        </Col>
                        <Col span={12}>

                            <Image src={selectedProduct?.image} width={300} height={300} />

                            <FileInput
                                files={image.files}
                                onChange={setImage}
                                label="Image"
                                placeholder="Image"
                            />
                        </Col>
                        <Col span={12}>
                            <Group position="apart">

                                {
                                    selectedProduct?.images.map((image) => (
                                        <Image src={image.image} width={200} height={200} />
                                    ))
                                }
                            </Group>
                            <FileInput
                                multiple // Add multiple attribute to enable selecting multiple images
                                files={additionalImages}
                                onChange={handleImageChange} // Use the handleImageChange function
                                label="Additional Images" // Change the label
                                placeholder="Additional Images"
                            />
                        </Col>

                        <Col span={12}>
                            <NumberInput value={selectedProduct?.available_quantity}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, available_quantity: e })}
                                label="Available Quantity" placeholder="Available Quantity" />
                        </Col>
                        <Col span={4}>
                            <Text size="sm">In Stock</Text>
                            <input
                                type="checkbox"
                                checked={selectedProduct?.in_stock}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, in_stock: e.target.checked })}

                            />
                        </Col>
                        <Col span={4}>
                            <Text size="sm">Discount</Text>
                            <input
                                type="checkbox"
                                checked={selectedProduct?.discount}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, discount: e.target.checked })}
                            />
                        </Col>
                        <Col span={4}>
                            <Text size="sm">New Arrival</Text>
                            <input
                                type="checkbox"
                                checked={selectedProduct?.new_arrival}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, new_arrival: e.target.checked })}
                            />
                        </Col>
                        <Col span={4}>
                            <Text size="sm">Best Selling Product</Text>
                            <input
                                type="checkbox"
                                checked={selectedProduct?.home_product}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, home_product: e.target.checked })}
                            />
                        </Col>
                        <Col span={4}>
                            <Text size="sm">Top Product</Text>
                            <input
                                type="checkbox"
                                checked={selectedProduct?.top_product}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, top_product: e.target.checked })}
                            />
                        </Col>
                        <Col span={4}>
                            <Text size="sm">New Product</Text>
                            <input
                                type="checkbox"
                                checked={selectedProduct?.new_product}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, new_product: e.target.checked })}
                            />
                        </Col>
                        <Col span={4}>
                            <Text size="sm">Show Size</Text>
                            <input
                                type="checkbox"
                                checked={selectedProduct?.show_size}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, show_size: e.target.checked })}
                            />
                        </Col>
                        <Col span={4}>
                            <Text size="sm">Show Color</Text>

                            <input
                                type="checkbox"
                                checked={selectedProduct?.show_color}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, show_color: e.target.checked })}
                            />
                        </Col>
                        <Col span={4}>
                            <Text size="sm">
                                Show Gender
                            </Text>
                            <input
                                type="checkbox"
                                checked={selectedProduct?.show_gender}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, show_gender: e.target.checked })}
                            />
                        </Col>

                    </Grid>

                    <Button m="xl" onClick={handleEditModalClose}>Cancel</Button>
                    <Button m="xl" type="submit" color="blue">Update</Button>
                </form>

            </Modal>



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
                            <Group>
                                <IconEdit onClick={() => handleEditModal(product)} size={24} />
                                <Menu shadow="md" width={200}>
                                    <Menu.Target>
                                        <IconTrash size={24} />
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>Delete this Order</Menu.Label>
                                        <Group>
                                            <Menu.Item
                                                onClick={() => handleProductDelete(product.id)}
                                            >
                                                Yes
                                            </Menu.Item>
                                            <Menu.Item>No</Menu.Item>
                                        </Group>
                                    </Menu.Dropdown>
                                </Menu>

                                <IconEye onClick={() => handleEditModal(product)} size={24} />
                            </Group>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default ProductTable;
