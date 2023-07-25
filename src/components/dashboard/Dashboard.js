import React, { useEffect, useState } from "react";
import {
  createStyles,
  Group,
  Paper,
  SimpleGrid,
  Text,
  rem,
  Card,
  Box,
} from "@mantine/core";
import {
  IconUserPlus,
  IconDiscount2,
  IconReceipt2,
  IconCoin,
  IconArrowUpRight,
  IconArrowDownRight,
} from "@tabler/icons-react";
import { API_URL } from "../../constant";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * 1.5)`,
  },

  value: {
    fontSize: rem(24),
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const navigate = useNavigate();

  const data = [
    {
      title: "Order",
      icon: IconReceipt2,
      value: orders?.length,
      diff: 34,
      link: "/order-table",
    },
    {
      title: "Products",
      icon: IconCoin,
      value: products?.length,
      diff: -13,
      link: "/product-table",
    },
    {
      title: "Users",
      icon: IconUserPlus,
      value: customers?.length,
      diff: 18,
      link: "/user",
    },
    {
      title: "Category",
      icon: IconDiscount2,
      value: category?.length,
      diff: -30,
      link: "/category-table",
    },
  ];

  const data2 = [
    {
      title: "Total Sales",
      icon: IconReceipt2,
      value: orders?.reduce((a, b) => a + b.total, 0),
      diff: 34,
      link: "/order-table",
    },
    {
      title: "Total Products Price",
      icon: IconCoin,
      value: products?.reduce((a, b) => a + b.price, 0),
      diff: -13,
      link: "/product-table",
    },
    {
      title: "Total Discount",
      icon: IconUserPlus,
      value: products?.reduce((a, b) => a + b.cancel_price, 0),
      diff: 18,
    },
    {
      title: "Total Cancel Order",
      icon: IconDiscount2,
      value: orders?.filter((item) => item.cancel == true).length,
      diff: -30,
      link: "/order-table",
    },
    {
      title: "Total Pending Order",
      icon: IconDiscount2,
      value: orders?.filter((item) => item.status.toLowerCase() != "delivered")
        .length,
      diff: -30,
      link: "/order-table",
    },
    {
      title: "Total Delivered Order",
      icon: IconDiscount2,
      value: orders?.filter((item) => item.status.toLowerCase() == "delivered")
        .length,
      diff: -30,
      link: "/order-table",
    },
  ];

  useEffect(() => {
    axios
      .get(`${API_URL}order/order/`)
      .then((res) => {
        setOrders(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}auth/user`)
      .then((res) => {
        setCustomers(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}product/product/`)
      .then((res) => {
        setProducts(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}category/category/`)
      .then((res) => {
        setCategory(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const { classes } = useStyles();
  const stats = data?.map((stat) => {
    const Icon = stat.icon;
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper
        withBorder
        p="md"
        color="red"
        radius="md"
        key={stat.title}
        style={{
          backgroundColor: "#006080",
        }}
        onClick={() => navigate(stat.link)}
      >
        <Group position="apart">
          <Text size="xs" color="white" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size="1.4rem" stroke={1.5} />
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          <Text
            color={stat.diff > 0 ? "teal" : "red"}
            fz="sm"
            fw={500}
            className={classes.diff}
          >
            <span>{stat.diff}%</span>
            <DiffIcon size="1rem" stroke={1.5} />
          </Text>
        </Group>

        <Text fz="xs" c="white" mt={7}>
          Total Number of {stat.title}
        </Text>
      </Paper>
    );
  });

  const stats2 = data2?.map((stat) => {
    const Icon = stat.icon;
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper
        withBorder
        p="md"
        color="red"
        radius="md"
        key={stat.title}
        style={{
          backgroundColor: "#006080",
        }}
        onClick={() => navigate(stat.link)}
      >
        <Group position="apart">
          <Text size="xs" color="white" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size="1.4rem" stroke={1.5} />
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          <Text
            color={stat.diff > 0 ? "teal" : "red"}
            fz="sm"
            fw={500}
            className={classes.diff}
          >
            <span>{stat.diff}%</span>
            <DiffIcon size="1rem" stroke={1.5} />
          </Text>
        </Group>

        <Text fz="xs" c="white" mt={7}>
          Total Number of {stat.title}
        </Text>
      </Paper>
    );
  });
  return (
    <div className={classes.root}>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "xs", cols: 1 },
        ]}
      >
        {stats}
      </SimpleGrid>
      <SimpleGrid
        cols={2}
        breakpoints={[
          { maxWidth: "md", cols: 3 },
          { maxWidth: "xs", cols: 2 },
        ]}
        mt="xl"
      >
        {stats2}
      </SimpleGrid>
    </div>
  );
}
