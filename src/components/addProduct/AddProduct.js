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
  NumberInput,
  Modal,
  UnstyledButton, Text, Group, Loader, MultiSelect
} from "@mantine/core";
import axios from "axios";
import { API_URL } from "../../constant";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { Editor, EditorState } from "draft-js";
import { useAuth } from "../../context/auth-context";
import "draft-js/dist/Draft.css";


const AddProduct = () => {
  const navigate = useNavigate();
  const [allCategory, setAllCategory] = useState([]);
  const [allBrand, setAllBrand] = useState([]);
  const { user } = useAuth()
  // const [image, setImage] = useState({ base64: "", files: [] });
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [cancelPrice, setCancelPrice] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [topProduct, setTopProduct] = useState(false);
  const [newProduct, setNewProduct] = useState(false);
  const [homeProduct, setHomeProduct] = useState(false);
  const [showSize, setShowSize] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showGender, setShowGender] = useState(false);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [showSizeModal, setShowSizeModal] = useState(false)
  const [showColorModal, setShowColorModal] = useState(false)
  const [showGenderModal, setShowGenderModal] = useState(false)
  const [sizes, setSizes] = useState('')
  const [colors, setColors] = useState([])
  const [genders, setGenders] = useState("")
  const [loading, setLoading] = useState(false)
  const [productImages, setProductImages] = useState([
    { image: [] }
  ])
  const [colorImage, setColorImage] = useState([
    {
      color: "",
      image: []
    }
  ])


  const [csvFile, setCsvFile] = useState([])

  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const editor = React.useRef(null);
  function focusEditor() {
    editor.current.focus();
  }
  const handleAddProductImageField = () => {
    setProductImages([...productImages, { image: "" }])
  }

  const handleRemoveProductImageField = (index) => {
    const values = [...productImages];
    values.splice(index, 1);
    setProductImages(values);
  }


  const handleAddColorImageField = () => {
    setColorImage([...colorImage, { color: "", image: "" }])
  }

  const handleRemoveColorImageField = (index) => {
    const values = [...colorImage];
    values.splice(index, 1);
    setColorImage(values);
  }

  const handleColorChange = (e, index) => {
    const updatedColorImage = [...colorImage];
    if (e.target.type === "file") {
      updatedColorImage[index].image = e.target.files[0];
    } else {
      updatedColorImage[index].color = e.target.value;
    }

    setColorImage(updatedColorImage);
  };

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

  const allBrandList = allBrand?.map((item) => {
    return {
      value: item.id,
      label: item.name,
      category: item.category,
    }
  }
  );

  // const [colors, setColors] = useState([]);

  const colorOptions = [
    // Your { value: "red", label: "Red" },
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
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("cancel_price", cancelPrice);
    formData.append("description", description);
    formData.append("image", productImages[0].image);
    formData.append("available_quantity", availableQuantity);
    formData.append("discount", discount);
    formData.append("new", newArrival);;
    formData.append("top_product", topProduct);
    formData.append("new_product", newProduct);
    formData.append("home_product", homeProduct);
    formData.append("show_size", showSize);
    formData.append("show_color", showColor);
    formData.append('show_gender', showGender)
    sizes && formData.append('size', JSON.stringify(sizes))
    colors && formData.append('color', JSON.stringify(colors))
    genders && formData.append('gender', JSON.stringify(genders))
    formData.append('user', user?.user_id)

    axios
      .post(`${API_URL}product/product/`, formData)
      .then((res) => {
        console.log(res);
        const productImagePromises = productImages?.map((file) => {
          const formDat = new FormData();
          formDat.append("product", res.data.id);
          formDat.append("image", file.image);
          return axios.post(`${API_URL}product/product_image/`, formDat);
        }) || []
        const colorImagePromises = colorImage?.map((file) => {
          const formDat = new FormData();
          formDat.append("product", res.data.id);
          formDat.append("color", file.color);
          formDat.append("image", file.image);
          return axios.post(`${API_URL}product/colorimage_fetch/`, formDat);
        }) || []

        // Combine all promises for parallel execution
        Promise.all([...productImagePromises, ...colorImagePromises])
          .then(() => {
            setLoading(false);
            notifications.show({
              title: "Product Added",
              message: "Product Added Successfully",
              color: "blue",
              autoClose: 5000,
            });
            navigate('/dashboard');
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            alert("Something went wrong");
          });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        alert("Something went wrong");
      });
  };

  console.log(colorImage)

  return (
    <Container size="sm">
      <Modal opened={showSizeModal} onClose={() => setShowSizeModal(false)} size="md">
        <Modal.Header>Add Size</Modal.Header>
        <Modal.Body>
          <TextInput
            label="Product Sizes"
            placeholder="Enter Sizes"
            value={sizes}
            onChange={(e) => setSizes(e.target.value)
            }
          />
        </Modal.Body>
        <Button onClick={() => setShowSizeModal(false)}>Save</Button>
      </Modal>
      <Modal opened={showColorModal} onClose={() => setShowColorModal(false)} size="md" height={900}>
             {
            colorImage.map((item, index) => {
              return (
                <>
                  <select 
                  className="form-control"
                  onChange={(e) => handleColorChange(e, index)}>
                    <option value="">Select Color</option>
                    {
                      colorOptions.map((item) => {
                        return (
                          <option value={item.value}>{item.label}</option>
                        )
                      })
                    }
                  </select>

                  <input
                    type="file"
                    onChange={(e) => handleColorChange(e, index)}
                    label="Images"
                    placeholder="Additional Images"
                  />
                  <Group position="right">
                    <Button size="xs" color="red" onClick={() => handleRemoveColorImageField(index)}>
                      <IconMinus size={20} />
                    </Button>
                  </Group>
                </>
                
              )})
             }
              
          
          <Group position="left">
            <Button
              size="xs"
              my="xl"
              color="teal"
              onClick={handleAddColorImageField}>
              <IconPlus size={20} />
            </Button>
          </Group>


        <Button onClick={() => setShowColorModal(false)} colorScheme="blue">
          Save
        </Button>

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
          value={genders}
          onChange={setGenders}
        />
        <Button onClick={() => setShowGenderModal(false)} mt={300}>Save </Button>
      </Modal>
      <Group position="apart">
        <h1>Add Product</h1>

      </Group>
      {
        loading && (
          <Loader size="xl" variant="bars" />
        )
      }
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
              <NumberInput value={availableQuantity} onChange={setAvailableQuantity} label="Available Quantity" placeholder="Available Quantity" />
            </Col>
            <Col span={4}>
              <Checkbox
                label="Show Discount"
                checked={discount}
                onChange={(event) => setDiscount(event.currentTarget.checked)}
              />
            </Col>
            <Col span={4}>
              <Checkbox
                label="Show New Arrival"
                checked={newArrival}
                onChange={(event) => setNewArrival(event.currentTarget.checked)}
              />
            </Col>
            <Col span={4}>
              <Checkbox
                label="Show Home Product"
                checked={homeProduct}
                onChange={(event) => setHomeProduct(event.currentTarget.checked)}
              />
            </Col>
            <Col span={4}>
              <Checkbox
                label="Show Top Product"
                checked={topProduct}
                onChange={(event) => setTopProduct(event.currentTarget.checked)}
              />
            </Col>
            <Col span={4}>
              <Checkbox
                label="Show New Product"
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
            </Col>
          </Grid>
          <Button mt="xl" type="submit" color="blue"
            loading={loading}
            disabled={loading}
          >
            Add Product
          </Button>
        </form>
      </Card>
    </Container>
  );
};

export default AddProduct;
