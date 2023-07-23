import React, { useState } from 'react';
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

function AddCategory() {
    const [category, setCategory] = useState('');
    const [image, setImage] = useState({ base64: '', files: [] });
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', category);
        formData.append('description', description);
        formData.append('image', image);
        axios
            .post(`${API_URL}category/category/`, formData)
            .then((res) => {
                console.log(res);
                alert('Category Added Successfully');
            })
            .catch((err) => {
                console.log(err);
                alert('Something went wrong');
            });
    };

    return (
        <Container size="sm">
            <Card shadow="sm">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Grid>
                        <Col span={12}>
                            <TextInput
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                label="Category Name"
                                placeholder="Category Name"
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
                        Add Category
                    </Button>
                </form>
            </Card>
        </Container>
    );
}

export default AddCategory;
