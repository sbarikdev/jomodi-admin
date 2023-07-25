import React from "react";
import { Table, Text, Group, Menu, Button, rem, UnstyledButton, Modal, TextInput } from "@mantine/core";
import axios from "axios";
import { API_URL } from "../../constant";
import { useEffect, useState } from "react";
import { IconEdit, IconEye, IconTrash, IconSearch } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { Checkbox, News } from "tabler-icons-react";
import dayjs from "dayjs";


const NewsLetter = () => {

    const [newsData, setNewsData] = useState([]);

    useEffect(() => {
        axios
            .get(`${API_URL}newsletter/newsletter/`)
            .then((res) => {
                console.log(res.data.results);
                setNewsData(res.data.results);
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
                    <th>
                    Email
                    </th>
                </tr>
            </thead>
            <tbody>
                {newsData.map((newsletter, index) => (
                    <tr key={newsletter.id}>
                        <td>{index}</td>
                        <td>{newsletter.email}</td>

                       
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default NewsLetter;
