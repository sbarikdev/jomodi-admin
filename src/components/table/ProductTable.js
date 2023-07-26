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
    Pagination
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
    const [filterName, setFilterName] = useState("");
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
            .get(`${API_URL}category/brand-detail/`)
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

                axios.get(

                )

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
    console.log(selectedProduct)

    const handleProductEdit = () => {
        if (selectedProduct) {
            const formData = new FormData();
            selectedProduct?.category && formData.append("category", selectedProduct.category.id);
            selectedProduct?.brand && formData.append("brand", selectedProduct.brand.id);
            // formData.append("category", selectedProduct.category);
            // formData.append("brand", selectedProduct.brand);
            productImages && formData.append("image", productImages[0].image);
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
                .patch(
                    `${API_URL}product/product/${selectedProduct.id}/`,
                    formData
                )
                .then((res) => {
                    console.log("jere")
                    console.log(res.data);

                    console.log(formData)

                    axios
                        .get(`${API_URL}product/product_detail/`)
                        .then((res) => {
                            console.log(res.data.results);
                            setProductData(res.data.results);
                        })

                    productImages?.forEach((file) => {
                        const formDat = new FormData();
                        if (isFile(file.image)) {
                            formDat.append("product", selectedProduct.id);
                            formDat.append("image", file.image);
                            axios.post(`${API_URL}product/product_image/`, formDat);
                        }

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

    const [page, setPage] = useState(1);

    const itemsPerPage = 10;

    const totalPages = Math.ceil(filterProductData?.length / itemsPerPage)


    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const paginatedItems = (
        filterProductData?.slice(
            (page - 1) * itemsPerPage,
            page * itemsPerPage)
    )


    const selectStyles = {
        input: {
            '::placeholder': {
                opacity: 1,
                color: 'black',
            },
        },
    };
    return (
        <div style={{
            backgroundColor: 'white',
        }}>
            <h3
                style={{
                    textAlign: 'center',
                    justifyContent: 'center',
                }}
            >
                Product Table
            </h3>
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
                                placeholder={`${selectedProduct?.brand?.name}` || "Select Brand"}
                                data={
                                    (
                                        allBrandList.filter((item) => (item.category?.id == selectedProduct?.category))
                                    )
                                }

                                value={selectedProduct?.brand}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, brand: e })}
                                styles={selectStyles}
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
                            <Group position="left">
                                {
                                    <Image width={300} height={150} fit="contain" src={selectedProduct?.image} mx="auto" radius="md" />}
                                {
                                    selectedProduct?.images.map((item, index) => (
                                        <Group>
                                            <Button size={20} color="teal" onClick={() => removeProductImage(item.id)}>
                                                <IconTrash size={15} />
                                            </Button>
                                            <Image width={300} height={150} fit="contain" src={item.image} key={index} mx="auto" radius="md" />
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
                        <th>Cancel Price</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>In Stock</th>
                        <th>Date Added</th>
                        <th>Action</th>

                    </tr>
                </thead>
                <tbody>
                    {(paginatedItems).map((product, index) => (
                        <tr key={product.id}>
                            <td>{index + 1}</td>
                            <td>{product.user?.first_name || product?.user?.username}</td>
                            <td>{product.name}</td>
                            <td>₹{product.price}</td>
                            <td>₹{product.cancel_price}</td>
                            <td>{product?.category?.name}</td>
                            <td>{product?.brand?.name}</td>
                            <td>{product.available_quantity > 0 ? "Yes" : "No"}</td>
                            <td>{dayjs(product.created_at).format("DD/MM/YYYY")}</td>
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

export default ProductTable;
