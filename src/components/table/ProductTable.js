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
    MultiSelect,
} from "@mantine/core";
import axios, { all } from "axios";
import { API_URL } from "../../constant";
import { useEffect, useState } from "react";
import { IconEdit, IconEye, IconTrash, IconSearch, IconMinus, IconPlus } from "@tabler/icons-react";
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
import FilterDiv from "../FilterDiv";


const ProductTable = () => {
    const [productData, setProductData] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [allCategory, setAllCategory] = useState([]);
    const [allBrand, setAllBrand] = useState([]);
    const [search, setSearch] = useState("");
    const [productImages, setProductImages] = useState([
        { image: [] }
    ])
    const  [filterName, setFilterName] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterBrand, setFilterBrand] = useState("");
    const [filteredData, setFilteredData] = useState([]);



    const handleAddProductImageField = () => {
        setProductImages([...productImages, { image: "" }])
    }

    const handleRemoveProductImageField = (index) => {
        const values = [...productImages];
        values.splice(index, 1);
        setProductImages(values);
    }


    const handleImageChange = (files, index) => {
        const updatedProductImages = [...productImages];
        updatedProductImages[index].image = files;
        setProductImages(updatedProductImages);
    };

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

    const removeProductImage = (id) => {
        axios
            .delete(`${API_URL}product/product_image/${id}/`)
            .then((res) => {
                console.log(res.data);
                notifications.show({
                    title: "Product Image Deleted",
                    message: "Product Image Deleted Successfully",
                    color: "white",
                    styles: (theme) => ({
                        root: {
                            backgroundColor: theme.colors.red[0],
                            borderColor: theme.colors.red[6],
                            "&::before": { backgroundColor: theme.white },
                        },
                    }),
                });

                // Update the selectedProduct state to remove the deleted image
                setSelectedProduct((prevSelectedProduct) => ({
                    ...prevSelectedProduct,
                    images: prevSelectedProduct.images.filter((image) => image.id !== id),
                }));

                // Update the productData state to remove the deleted product
                setProductData((prevProductData) =>
                    prevProductData.filter((product) => product.id !== selectedProduct.id)
                );
            })
            .catch((err) => {
                console.log(err);
            });
    };


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

    const isFile = (input) => "File" in window && input instanceof File;
    console.log(productImages)

    const handleProductEdit = () => {
        if (selectedProduct) {
            const formData = new FormData();
            formData.append("category", selectedProduct.category);
            formData.append("brand", selectedProduct.brand);
            formData.append("name", selectedProduct.name);
            formData.append("price", selectedProduct.price);
            formData.append("cancel_price", selectedProduct.cancel_price);
            formData.append("description", selectedProduct.description);
            formData.append("available_quantity", selectedProduct.available_quantity);
            formData.append("discount", selectedProduct.discount);
            formData.append("new_arrival", selectedProduct.new_arrival);
            formData.append("top_product", selectedProduct.top_product);
            formData.append("new_product", selectedProduct.new_product);
            formData.append("show_size", selectedProduct.show_size);
            formData.append("show_color", selectedProduct.show_color);
            formData.append('show_gender', selectedProduct.show_gender)

            axios
                .put(
                    `${API_URL}product/product_detail/${selectedProduct.id}/`,
                    formData
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

                    // Close the edit modal

                    productImages.forEach((file) => {
                        const formDat = new FormData();
                        formDat.append("product", selectedProduct.id);
                        formDat.append("image", file.image);
                        axios.post(`${API_URL}product/product_image/`, formDat);
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
    // useEffect to handle filtering when filter criteria change
    // const filterData = productData.filter((item) => {
    //     return (
    //         filterCategory.includes(item.category.id) ||
    //         filterBrand.includes(item.brand.id) ||
    //         item.name.toLowerCase().includes(filterName.toLowerCase()) ||
    //         item.category.name.toLowerCase().includes(filterName.toLowerCase()) ||
    //         item.brand.name.toLowerCase().includes(filterName.toLowerCase())
    //     );
    // });

    const filterData = productData.filter((item) => {
        // Check if filterCategory is an array and includes the category ID
        const categoryMatch = Array.isArray(filterCategory) && filterCategory.includes(item.category.id);
        const brandMatch = Array.isArray(filterBrand) && filterBrand.includes(item.brand.id);

        // Check if filterName exists and matches the brand name or category name (case-insensitive)
        const nameMatch = filterName && (
            item.name.toLowerCase().includes(filterName.toLowerCase()) ||
            (item.category && item.category.name.toLowerCase().includes(filterName.toLowerCase()))
        );

        // Return true if any of the filter criteria match, otherwise false
        return categoryMatch || nameMatch || brandMatch;
    });


    const filterProductData = filterData?.length ? filterData : productData;

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
                <MultiSelect
                    label="Brand"
                    placeholder="Select brand"
                    value={filterBrand}
                    onChange={(value) => setFilterBrand(value)}
                    data={allBrandList}
                />
            </div>
            <Table striped>
                <Modal
                    opened={editModalOpen}
                    onClose={handleEditModalClose}
                    size="70%"
                    padding="md"
                >
                    <Modal.Title>Edit Product</Modal.Title>

                    <Grid>
                        <Col span={12}>
                            <Select
                                label="Select Category"
                                placeholder="Select Category"
                                data={
                                    allCategoryList
                                }
                                defaultValue={selectedProduct?.category?.id}
                                value={selectedProduct?.category?.id}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e })}
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
                                defaultValue={selectedProduct?.brand?.id}
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
                            <Group position="apart">
                                {
                                    selectedProduct?.images.map((item, index) => (
                                        <Group>
                                            <Button size={20} color="teal" onClick={() => removeProductImage(item.id)}>
                                                <IconTrash size={15} />
                                            </Button>
                                            <Image width={200} height={80} fit="contain" src={item.image} key={index} mx="auto" radius="md" />
                                        </Group>
                                    ))
                                }
                            </Group>
                        </Col>

                        <Col span={12}>
                            {
                                productImages.map((item, index) => {
                                    return (
                                        <div>
                                            <FileInput
                                                value={item.image}
                                                onChange={(e) => handleImageChange(e, index)}
                                                label="Images"
                                                placeholder="Additional Images"
                                            />
                                            {
                                                productImages.length > 1 && (
                                                    <Button
                                                        mt="sm"
                                                        size="xs"
                                                        color="red"
                                                        onClick={() => handleRemoveProductImageField(index)}>
                                                        <IconMinus size={20} />
                                                    </Button>
                                                )
                                            }
                                        </div>
                                    )
                                }
                                )
                            }
                            <Group position="right">
                                <Button
                                    size="xs"
                                    color="teal" onClick={handleAddProductImageField}>
                                    <IconPlus size={20} />
                                </Button>
                            </Group>
                        </Col>

                        <Col span={12}>
                            <NumberInput value={selectedProduct?.available_quantity}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, available_quantity: e })}
                                label="Available Quantity" placeholder="Available Quantity" />
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
                    <Button m="xl"
                        onClick={handleProductEdit}
                        color="blue">Update</Button>


                </Modal>



                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Added By</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>In Stock</th>
                        <th>Action</th>
                        <th>Date Added</th>
                    </tr>
                </thead>
                <tbody>
                    {(filterProductData).map((product, index) => (
                        <tr key={product.id}>
                            <td>{index + 1}</td>
                            <td>{product.user?.first_name}</td>
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
                            <td>{dayjs(product.created_at).format("DD/MM/YYYY")}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

        </div>

    );
};

export default ProductTable;
