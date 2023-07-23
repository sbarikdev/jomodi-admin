import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Input,
  Grid,
  Textarea,
  TextInput,
  FileInput,
  Checkbox,
  Select,
  NumberInput
} from "@mantine/core";
import axios from "axios";
import { API_URL } from "../../constant";


const AddProduct = () => {
  const [allCategory, setAllCategory] = useState([]);
  const [allBrand, setAllBrand] = useState([]);
  const [image, setImage] = useState({ base64: "", files: [] });
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [cancelPrice, setCancelPrice] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [homeProduct, setHomeProduct] = useState(false);
  const [topProduct, setTopProduct] = useState(false);
  const [newProduct, setNewProduct] = useState(false);
  const [showSize, setShowSize] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showGender, setShowGender] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [additionalImages, setAdditionalImages] = useState([]);
  
  const handleImageChange = (files) => {
    // Function to update the additional images state
    setAdditionalImages(files);
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

    const allBrandList = allBrand?.map((item) => {
      return {
        value: item.id,
        label: item.name,
        category: item.category,
    }
  }
    );

  const handleSubmit = (e) => { 
    e.preventDefault();
    const formData = new FormData();
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("cancel_price", cancelPrice);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("available_quantity", availableQuantity);
    formData.append("in_stock", inStock);
    formData.append("discount", discount);
    formData.append("new", newArrival);
    formData.append("home_product", homeProduct);
    formData.append("top_product", topProduct);
    formData.append("new_product", newProduct);
    formData.append("show_size", showSize);
    formData.append("show_color", showColor);

    axios
      .post(`${API_URL}product/product/`, formData)
      .then((res) => {
        console.log(res);
        additionalImages.forEach((file) => {
          const formDat = new FormData();
          formDat.append("product", res.data.id);
          formDat.append("image", file);
          axios.post(`${API_URL}product/product_image/`, formDat);
        });
        alert("Product Added Successfully");
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong");
      });
  };


  return (
    <Container size="sm">
      <Card shadow="sm">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid>
            <Col span={12}>
              <Select
                label="Select Category"
                placeholder="Select Category"
                data={
                  allCategoryList
                }
                value={category}
                onChange={setCategory}
              />
            </Col>
            <Col span={12}>
              <Select
                label="Select Brand"
                placeholder="Select Brand"
                data={
                  allBrandList.filter((item) => item.category.id == category)
                }
                value={brand}
                onChange={setBrand}
              />
            </Col>
            <Col span={6}>
              <NumberInput
                value={price}
                onChange={setPrice}
                label="Price"
                placeholder="Price"
                required
              />
            </Col>
            <Col span={6}>
              <NumberInput
                value={cancelPrice}
                onChange={setCancelPrice}
                label="Cancel Price"
                placeholder="Cancel Price"
              />
            </Col>
            <Col span={12}>
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="Product Name"
                placeholder="Product Name"
                required
              />
            </Col>
      
            <Col span={12}>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                label="Description"
                placeholder="Description"
              />
            </Col>
            <Col span={12}>
              <FileInput
                files={image.files}
                onChange={setImage}
                label="Image"
                placeholder="Image"
              />
            </Col>
            <Col span={12}>
              <FileInput
                multiple // Add multiple attribute to enable selecting multiple images
                files={additionalImages}
                onChange={handleImageChange} // Use the handleImageChange function
                label="Additional Images" // Change the label
                placeholder="Additional Images"
              />
            </Col>
       
            <Col span={12}>
              <NumberInput value={availableQuantity} onChange={setAvailableQuantity} label="Available Quantity" placeholder="Available Quantity" />
            </Col>
            <Col span={4}>
              <Checkbox
                label="In Stock"
                checked={inStock}
                onChange={(event) => setInStock(event.currentTarget.checked)} />
            </Col>
            <Col span={4}>
              <Checkbox
                label="Discount"
                checked={discount}
                onChange={(event) => setDiscount(event.currentTarget.checked)}
              />
            </Col>
            <Col span={4}>
              <Checkbox

                label="New Arrival"
                checked={newArrival}
                onChange={(event) => setNewArrival(event.currentTarget.checked)}
              />
            </Col>
            <Col span={4}>
              <Checkbox
                label="Best Selling Product"
                checked={homeProduct}
                onChange={(event) => setHomeProduct(event.currentTarget.checked)}
              />
            </Col>
            <Col span={4}>
              <Checkbox
              label="Top Product"
              checked={topProduct}
              onChange={(event) => setTopProduct(event.currentTarget.checked)}
              />
            </Col>
            <Col span={4}>
              <Checkbox
              label="New Product"
              checked={newProduct}
              onChange={(event) => setNewProduct(event.currentTarget.checked)}
              />
            </Col>
            <Col span={4}>
              <Checkbox
              label="Show Size"
              checked={showSize}
              onChange={(event) => setShowSize(event.currentTarget.checked)}
              />
            </Col>
            <Col span={4}>
              <Checkbox
              label="Show Color"
              checked={showColor}
              onChange={(event) => setShowColor(event.currentTarget.checked)}
              />
            </Col>
            <Col span={4}>
              <Checkbox
              label="Show Gender"
              checked={showGender}
              onChange={(event) => setShowGender(event.currentTarget.checked)}
              />
            </Col>
          
          </Grid>
          

          <Button mt="xl" type="submit" color="blue">
            Add Product
          </Button>
        </form>
      </Card>
    </Container>
  );
};

export default AddProduct;
