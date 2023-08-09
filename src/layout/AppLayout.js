import React, { useState } from "react";
import { AppShell, useMantineTheme } from "@mantine/core";
import { Navbar, Header } from '@mantine/core';
import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import AppSide from "../components/AppSide";

function MainLayout(props) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
      <AppShell
        padding="md"
        navbar={<Navbar width={{ base: 200 }} height={500} p="xs">
          <AppSide />
        </Navbar>}
        header={<Header height={60} p="xs">
          <AppHeader />
        </Header>}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
      <Outlet />
      </AppShell>
  );
}

export default MainLayout;
