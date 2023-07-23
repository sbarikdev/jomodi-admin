import React, {useState, useEffect} from 'react'
import AppSide from '../AppSide'
import axios from 'axios'
import { API_URL} from  '../../constant/index'

function Dashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get(`${API_URL}order/order`)
    .then(res => {  
      setOrders(res.data.results)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  useEffect(() => {
    axios.get(`${API_URL}product/product`)
    .then(res => {
      setProducts(res.data.results)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  useEffect(() => {
    axios.get(`${API_URL}auth/user`)
    .then(res => {
      setUsers(res.data.results)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])


  return (
    <div>
     <h4>
        Total Orders: {orders.length}
     </h4>
    </div>
  )
}

export default Dashboard