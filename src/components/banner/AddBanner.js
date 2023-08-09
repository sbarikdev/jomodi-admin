import React, {useEffect,  useState} from 'react'
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
  TextInput, Loader
} from '@mantine/core';
import { IconEdit, IconEye, IconTrash, IconSearch } from '@tabler/icons-react'
import { API_URL } from '../../constant'
import axios from 'axios'
import dayjs from 'dayjs'
import {notifications} from '@mantine/notifications'
import { useNavigate } from 'react-router-dom';

function AddBanner() {
  const navigate = useNavigate()
  const [bannerImage, setBannerImage] = useState({ base64: "", files: [] })
  const [loading, setLoading] = useState(false)

  const handleBannerImage = (e) => {
    setBannerImage(e.target.files[0])
  }

  const handleBannerAdd = () => {
    const formData = new FormData()
    setLoading(true)
    formData.append('image', bannerImage)
    axios
      .post(`${API_URL}/product/home_banner_image/`, formData)
      .then((res) => {
        console.log(res.data)
        notifications.show({
          title: 'Banner Added',
          message: 'Banner Added Successfully',
          color: 'green',
          autoClose: 5000,
      })
      navigate('/dashboard/')
      setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  return (
    <Container size="sm">
      <Card shadow="sm">
        <h1>Change Banner</h1>
        <form encType="form-data">
          <Grid>
            {
              loading && <Loader variant='bars' />
            }
            <Col span={12}>
              <FileInput
                files={bannerImage.files}
                onChange={setBannerImage}
                label="Image"
                placeholder="Image"
              />
            </Col>
          </Grid>
          <Button onClick={() => handleBannerAdd()} mt="xl" type="submit" color="blue"
          disabled={loading}
          loading={loading}
          >
            Add Banner
          </Button>
        </form>
      </Card>
    </Container>
  )
}

export default AddBanner