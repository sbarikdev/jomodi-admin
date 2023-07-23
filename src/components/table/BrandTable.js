import React from "react";
import { Table, Text } from "@mantine/core";
import axios from "axios";
import { API_URL } from "../../constant";
import { useEffect, useState } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";


const BrandTable = () => {

    const [brandData, setBrandData] = useState([]);

    useEffect(() => {
        axios
            .get(`${API_URL}category/brand/`)
            .then((res) => {
                console.log(res.data.results);
                setBrandData(res.data.results);
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
                    <th>
                        Category
                    </th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {brandData.map((brand) => (
                    <tr key={brand.id}>
                        <td>{brand.id}</td>
                        <td>{brand.name}</td>
                        <td>{brand.category.name}</td>
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

export default BrandTable;
