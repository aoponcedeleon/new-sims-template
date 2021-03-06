import React, { useState, useEffect } from "react";
import { AuthenticationForm } from "../components/AuthenticationForm";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { useLocalStorage } from "@mantine/hooks";

import "./App.css";

import DashboardShell from "../components/DashboardShell";
function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  // temporary auth state management
  const [user, setUserState] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Dev mode on 🚀");
    }

    const token = sessionStorage.getItem("token");
    if (token !== null) {
      const username = sessionStorage.getItem("user");
      const adminToken =
        sessionStorage.getItem("isAdmin") === "true" ? true : false;
      setIsAdmin(adminToken);
      setUserState(username);
    }
  }, [user]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={{ colorScheme }}>
        <ModalsProvider>
          <NotificationsProvider>
            {user !== null ? (
              <DashboardShell
                user={user}
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
                setUserState={setUserState}
              />
            ) : (
              <AuthenticationForm
                user={user}
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
                setUserState={setUserState}
              />
            )}
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
