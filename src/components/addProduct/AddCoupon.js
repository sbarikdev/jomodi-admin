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
    NumberInput,
} from '@mantine/core';
import axios from 'axios';
import { API_URL } from '../../constant';
import { notifications } from '@mantine/notifications';
import { DateInput } from '@mantine/dates';
import { useNavigate } from 'react-router-dom';

function AddCoupon() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [image, setImage] = useState({ base64: '', files: [] });
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [expiryDate, setExpiryDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [numberAvailable, setNumberAvailable] = useState(0);


    const formatISODate = (date) => {
        return date.toISOString();
    };

    const isFile = (input) => "File" in window && input instanceof File;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('code', code);
        formData.append('discount', discount);
        formData.append('end_date', formatISODate(expiryDate));
        formData.append('start_date', formatISODate(startDate));
        formData.append('number_available', numberAvailable);
        formData.append('active', true);


        isFile(image) && formData.append('image', image);
        axios
            .post(`${API_URL}order/coupon-admin/`, formData)
            .then((res) => {
                console.log(res);

                notifications.show({
                    title: "Coupon Added",
                    message: "Coupon Added Successfully",
                    color: "green",
                    autoClose: 5000,
                });
                navigate('/coupon-table');

            })
            .catch((err) => {
                console.log(err);
                notifications.show({
                    title: "Something went wrong",
                    message: "Something went wrong",
                    color: "red",
                    autoClose: 5000,
                });
            });
    };

    return (
        <Container size="sm">
            <Card shadow="sm">
                <h1>Add Coupon</h1>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Grid>
                        <Col span={12}>
                            <TextInput
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                label="Coupon Title"
                                placeholder="Coupon Title"
                                required
                            />
                        </Col>
                        <Col span={12}>
                            <TextInput
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                label="Coupon Code"
                                placeholder="Coupon Code"
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
                        <Col span={6}>
                            <NumberInput
                                value={discount}
                                onChange={(e) => setDiscount(e)}
                                label="Discount"
                                placeholder="Discount"
                                required
                            />
                        </Col>
                        <Col span={6}>
                            <NumberInput
                                value={numberAvailable}
                                onChange={(e) => setNumberAvailable(e)}
                                label="Number Available"
                                placeholder="Number Available"

                                required
                            />
                        </Col>
                        <Col span={6}>
                            <DateInput
                                value={startDate}
                                onChange={setStartDate}
                                label="Start Date"
                                placeholder="Start Date"
                                required
                            />
                        </Col>
                        <Col span={6}>
                            <DateInput
                                value={expiryDate}
                                onChange={setExpiryDate}
                                label="Expiry Date"
                                placeholder="Expiry Date"
                                required
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

export default AddCoupon;
