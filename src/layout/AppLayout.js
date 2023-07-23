import React, { useState } from "react";
import {
  AppShell, Navbar, Header, Text,
  Footer,
  Aside,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import AppSide from "../components/AppSide";



function MainLayout(props) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (

    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      header={
        <AppHeader />
      }
      navbar={
        <AppSide p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }} />
      }
      
    >
      <Outlet />
    </AppShell>

  );
}

export default MainLayout;
