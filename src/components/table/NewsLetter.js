import React from "react";
import { Table, Text, Group, Menu, Button, rem, UnstyledButton, Modal, TextInput, Pagination } from "@mantine/core";
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

    const [page, setPage] = useState(1);

    const itemsPerPage = 10;

    const totalPages = Math.ceil(newsData?.length / itemsPerPage)


    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const paginatedItems = (
        newsData?.slice(
            (page - 1) * itemsPerPage,
            page * itemsPerPage)
    )
   
    return (
        <div>
<Table striped>
           
            <thead>
                <tr>
                    <th>ID</th>
                    <th>
                    Email
                    </th>
                    <th>
                        Date Created
                         </th>
                </tr>
            </thead>
            <tbody>
                {paginatedItems.map((newsletter, index) => (
                    <tr key={newsletter.id}>
                        <td>{index}</td>
                        <td>{newsletter.email}</td>
                        <td>{dayjs(newsletter.created_at).format("DD/MM/YYYY")}</td>
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

export default NewsLetter;
