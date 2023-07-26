import React, { useEffect, useState } from 'react';
import {
    Card,
    Col,
    Container,
    Grid,
    Input,
    FileInput,
    Select,
    Textarea,
    Button,
    Text,
    TextInput,
} from '@mantine/core';
import axios from 'axios';
import { API_URL } from '../../constant';
import { notifications } from '@mantine/notifications';

function AddBrand() {
    const [category, setCategory] = useState('');
    const [allCategory, setAllCategory] = useState([]);
    const [image, setImage] = useState({ base64: '', files: [] });
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');

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

    const allCategoryList = allCategory?.map((item) => {
        return {
            value: item.id,
            label: item.name,
        };
    });
    const isFile = (input) => "File" in window && input instanceof File;
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('category', category);
        formData.append('name', brand);
        formData.append('description', description);
        isFile(image) && formData.append('image', image);
        axios
            .post(`${API_URL}category/brand/`, formData)
            .then((res) => {
                console.log(res);
                notifications.show({
                    title: 'Brand Added',
                    message: 'Brand Added Successfully',
                    color: 'green',
                    autoClose: 5000,
                });
            })
            .catch((err) => {
                console.log(err);
                notifications.show({
                    title: 'Something went wrong',
                    message: 'Something went wrong',
                    color: 'red',
                    autoClose: 5000,
                });
            });
    };

    return (
        <Container size="sm">
            <Card shadow="sm">
                <h1>Add Brand</h1>
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
                            <TextInput
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                label="Brand Name"
                                placeholder="Brand Name"
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
                    </Grid>

                    <Button mt="xl" type="submit" color="blue">
                        Add Brand
                    </Button>
                </form>
            </Card>
        </Container>
    );
}

export default AddBrand;
