import React from "react";
import { Table, Text } from "@mantine/core";
import axios from "axios";
import { API_URL } from "../../constant";
import { useEffect, useState } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";


const CategoryTable = () => {

    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        axios
            .get(`${API_URL}category/category/`)
            .then((res) => {
                console.log(res.data.results);
                setCategoryData(res.data.results);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    return (
        <Table striped>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {categoryData.map((category) => (
                    <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>{category.name}</td>
                        <td>
                            <IconEdit size={24} />
                            <IconTrash size={24} />

                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default CategoryTable;
