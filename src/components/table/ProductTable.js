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

    const [showSizeModal, setShowSizeModal] = useState(false)
    const [showColorModal, setShowColorModal] = useState(false)
    const [showGenderModal, setShowGenderModal] = useState(false)
    const [sizes, setSizes] = useState('')
    const [colors, setColors] = useState("")
    const [genders, setGenders] = useState("")



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
        const img = productImages[0]?.image
        if (selectedProduct) {
            const formData = new FormData();
            selectedProduct?.category && formData.append("category", selectedProduct.category.id);
            selectedProduct?.brand && formData.append("brand", selectedProduct.brand.id);

            isFile(img) && formData.append("image", img);
            formData.append("name", selectedProduct.name);
            formData.append("price", selectedProduct.price);
            formData.append("cancel_price", selectedProduct.cancel_price);
            formData.append("description", selectedProduct.description);
            formData.append("available_quantity", selectedProduct.available_quantity);
            formData.append("discount", selectedProduct.discount);
            formData.append("new_arrival", selectedProduct.new_arrival);
            formData.append("top_product", selectedProduct.top_product);
            formData.append("new_product", selectedProduct.new_product);
            formData.append('home_product', selectedProduct.home_product)
            formData.append("show_size", selectedProduct.show_size);
            formData.append("show_color", selectedProduct.show_color);
            formData.append('show_gender', selectedProduct.show_gender)
            formData.append('size', JSON.stringify(selectedProduct?.size))
            formData.append('color', JSON.stringify(selectedProduct?.color))
            formData.append('gender', JSON.stringify(selectedProduct?.gender))
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

    const [paginationNumber, setPaginationNumber] = useState(10)

    const [page, setPage] = useState(1);

    const itemsPerPage = paginationNumber;

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

                <Select
                    label={`Show ${paginationNumber} per page `}
                    value={paginationNumber} onChange={setPaginationNumber} data={[
                        { value: 10, label: '10' },
                        { value: 20, label: '20' },
                        { value: 30, label: '30' },
                        { value: 40, label: '40' },
                        { value: 50, label: '50' }
                    ]} />
            </div>
            <Table striped>
                <Modal
                    opened={editModalOpen}
                    onClose={handleEditModalClose}
                    size="70%"
                    padding="md"
                >
                    <Modal opened={showSizeModal} onClose={() => setShowSizeModal(false)} size="md">
                        <Modal.Header>Add Size</Modal.Header>
                        <Modal.Body>
                            <TextInput
                                label="Product Sizes"
                                placeholder="Enter Sizes"
                                value={selectedProduct?.size}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, size: e.target.value })}

                            />
                        </Modal.Body>
                        <Button onClick={() => setShowSizeModal(false)}>Save</Button>
                    </Modal>
                    <Modal opened={showColorModal} onClose={() => setShowColorModal(false)} size="md" height={500}>
                        <MultiSelect
                            data={[
                                { value: "red", label: "Red" },
                                { value: "blue", label: "Blue" },
                                { value: "green", label: "Green" },
                                { value: "yellow", label: "Yellow" },
                                { value: "black", label: "Black" },
                                { value: "white", label: "White" },
                                { value: "pink", label: "Pink" },
                                { value: "purple", label: "Purple" },
                                { value: "orange", label: "Orange" },
                                { value: "brown", label: "Brown" },
                                { value: "gray", label: "Gray" },
                                { value: "silver", label: "Silver" },
                                { value: "gold", label: "Gold" },
                            ]}
                            label="Product Color"
                            placeholder="Enter Color"
                            value={selectedProduct?.color}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, color: e })
                            }
                        />
                        <Button onClick={() => setShowColorModal(false)} mt={300}>Save </Button>
                    </Modal>

                    <Modal opened={showGenderModal} onClose={() => setShowGenderModal(false)} size="md" height={500}>
                        <MultiSelect
                            data={[
                                { value: "Man", label: "Man" },
                                { value: "Woman", label: "Woman" },
                                { value: "Boy", label: "Boy" },
                                { value: "Girl", label: "Girl" },
                                { value: "Kids", label: "Kids" },
                            ]}
                            label="Select Gender"
                            placeholder="Enter Gender"
                            value={selectedProduct?.gender}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, gender: e })}
                        />
                        <Button onClick={() => setShowGenderModal(false)} mt={300}>Save </Button>
                    </Modal>

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
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <Image width={150} height={120} fit="contain" src={selectedProduct?.image} mx="auto" radius="md" />
                                    </div>

                                }
                                {
                                    selectedProduct?.images?.map((item, index) => (
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <Image width={150} height={120} fit="contain" src={item.image} key={index} mx="auto" radius="md" />
                                            <Button
                                                size={10}
                                                color="red"
                                                onClick={() => removeProductImage(item.id)}
                                                style={{ position: 'absolute', top: 0, right: 0 }}
                                            >
                                                <IconTrash size={15} />
                                            </Button>
                                        </div>
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
                            <Text size="sm">Show Discount</Text>
                            <input
                                type="checkbox"
                                checked={selectedProduct?.discount}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, discount: e.target.checked })}
                            />
                        </Col>
                        <Col span={4}>
                            <Text size="sm">Show New Arrival</Text>
                            <input
                                type="checkbox"
                                checked={selectedProduct?.new_arrival}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, new_arrival: e.target.checked })}
                            />
                        </Col>
                        <Col span={4}>
                            <Text size="sm">Show Top Product</Text>
                            <input
                                type="checkbox"
                                checked={selectedProduct?.top_product}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, top_product: e.target.checked })}
                            />
                        </Col>
                        <Col span={4}>
                            <Text size="sm">Show Home Product</Text>
                            <input
                                type="checkbox"
                                checked={selectedProduct?.home_product}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, home_product: e.target.checked })}
                            />
                        </Col>
                        <Col span={4}>
                            <Text size="sm">Show New Product</Text>
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
                            {
                                selectedProduct?.show_size && (
                                    <UnstyledButton onClick={() => setShowSizeModal(true)} >
                                        <IconPlus size={20} />
                                    </UnstyledButton>
                                )
                            }
                            {/* <Group mt="sm" position="left">
                                {
                                    sizes.split(',').map((item) => {
                                        return (
                                            <Text>{item}</Text>
                                        )
                                    })
                                }
                            </Group> */}
                        </Col>
                        <Col span={4}>
                            <Text size="sm">Show Color</Text>

                            <input
                                type="checkbox"
                                checked={selectedProduct?.show_color}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, show_color: e.target.checked })}
                            />
                            {
                                selectedProduct?.show_color && (
                                    <UnstyledButton onClick={() => setShowColorModal(true)}>
                                        <IconPlus size={20} />
                                    </UnstyledButton>
                                )
                            }
                            {/* <Group mt="sm" position="left">
                                {
                                    colors && colors?.map((item) =>
                                    (
                                        <Text>{item}</Text>
                                    )
                                    )

                                }
                            </Group> */}
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
                            {
                                selectedProduct?.show_gender && (
                                    <UnstyledButton onClick={() => setShowGenderModal(true)}>
                                        <IconPlus size={20} />
                                    </UnstyledButton>
                                )
                            }
                            {/* <Group mt="sm" position="left">
                                {
                                    genders && genders?.map((item) =>
                                    (
                                        <Text>{item}</Text>
                                    )
                                    )

                                }
                            </Group> */}
                        </Col>

                        {/* <Col span={4}>
                            <Checkbox
                                label="Show Size"
                                checked={showSize}
                                onChange={(event) => setShowSize(event.currentTarget.checked)}
                            />
                            {
                                showSize && (
                                    <UnstyledButton onClick={() => setShowSizeModal(true)} >
                                        <IconPlus size={20} />
                                    </UnstyledButton>
                                )
                            }
                            <Group mt="sm" position="left">
                                {
                                    sizes.split(',').map((item) => {
                                        return (
                                            <Text>{item}</Text>
                                        )
                                    })
                                }
                            </Group>

                        </Col>
                        <Col span={4}>
                            <Checkbox
                                label="Show Color"
                                checked={showColor}
                                onChange={(event) => setShowColor(event.currentTarget.checked)}
                            />
                            {
                                showColor && (
                                    <UnstyledButton onClick={() => setShowColorModal(true)}>
                                        <IconPlus size={20} />
                                    </UnstyledButton>
                                )
                            }
                            <Group mt="sm" position="left">
                                {
                                    colors && colors?.map((item) =>
                                    (
                                        <Text>{item}</Text>
                                    )
                                    )

                                }
                            </Group>
                        </Col>
                        <Col span={4}>
                            <Checkbox
                                label="Show Gender"
                                checked={showGender}
                                onChange={(event) => setShowGender(event.currentTarget.checked)}
                            />
                            {
                                showGender && (
                                    <UnstyledButton onClick={() => setShowGenderModal(true)}>
                                        <IconPlus size={20} />
                                    </UnstyledButton>
                                )
                            }
                            <Group mt="sm" position="left">
                                {
                                    genders && genders?.map((item) =>
                                    (
                                        <Text>{item}</Text>
                                    )
                                    )

                                }
                            </Group>
                        </Col> */}

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
