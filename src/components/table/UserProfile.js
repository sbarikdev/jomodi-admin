import React from "react";
import { Table, Text, Group, Menu, Button, rem, UnstyledButton, Modal, TextInput } from "@mantine/core";
import axios from "axios";
import { API_URL } from "../../constant";
import { useEffect, useState } from "react";
import { IconEdit, IconEye, IconTrash, IconSearch } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { Checkbox } from "tabler-icons-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [orderData, setOrderData] = useState([]);
    const [filterName, setFilterName] = useState("");

    useEffect(() => {
        axios
            .get(`${API_URL}order/order/`)
            .then((res) => {
                console.log(res.data.results);
                setOrderData(res.data.results);

            }) 
            .catch((err) => {
                console.log(err);
            });
    }, []);
    useEffect(() => {
        axios
            .get(`${API_URL}auth/profile`)
            .then((res) => {
                console.log(res.data.results);
                setProfileData(res.data.results);

            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const filterData = profileData.filter((item) => {
        // Check if filterCategory is an array and includes the category ID

        // Check if filterName exists and matches the brand name or category name (case-insensitive)
        const nameMatch = filterName && (
            item?.first_name?.toLowerCase().includes(filterName.toLowerCase()) || item?.user?.username.toLowerCase().includes(filterName.toLowerCase())
            || item?.last_name?.toLowerCase().includes(filterName.toLowerCase()) || item?.address?.toLowerCase().includes(filterName.toLowerCase())
        );

        // Return true if any of the filter criteria match, otherwise false
        return nameMatch;
    });



    const filteredData = filterData.length ? filterData : profileData;
    

    return (
        <div 
        style={{
            backgroundColor: 'white',
        }}
        >
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <TextInput
                    label="Name"
                    value={filterName}
                    onChange={(event) => setFilterName(event.currentTarget.value)}
                    placeholder="Enter name..."
                />
            </div>
        <Table striped>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Date of Birth</th>
                    <th>Hint Name</th>
                    <th>
                       Number of Order
                    </th>
                    <th>
                        Date Joined
                    </th>
                </tr>
            </thead>
            <tbody>
                {filteredData?.map((profile, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{profile.first_name || "Not Added"} {profile.last_naem}</td>
                        <td>{profile.user.username || "Not Added"} </td>
                        <td>{profile.address || "Not Added"}</td>
                        <td>
                           {profile.date_of_birth || "Not Added"}
                        </td>
                        <td>
                            {profile.hint_name || "Not Added"}
                        </td>
                        <td>
                            <UnstyledButton 
                            onClick={() => navigate(`/user-order/${profile.user.id}`) }
                            >

                                <Text size="sm" weight={500} color="red">
                                {
                                    orderData.filter((order) => order.user == profile.user.id).length
                                }
                            </Text>  
                            </UnstyledButton>
                          
                        </td>
                        <td>
                            {dayjs(profile.created_at).format("DD/MM/YYYY")}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </div>
    );
};

export default UserProfile;
