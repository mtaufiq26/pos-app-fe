import { useEffect, useState } from "react";
import { Button, Drawer, Navbar } from "react-daisyui";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { FaBars } from "react-icons/fa";
import ToggleDark from "./components/ToggleDark";
import { useAccount } from "./hooks";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import store from "./features/store";

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { login, logout, loginResult } = useAccount();

  const toggleDrawer = () => {
    setDrawerOpen(open => !open);
  };

  useEffect(() => {
    login();
  }, []);

  useEffect(() => {
    // !loginResult.username && logout();
    // console.log(loginResult);
  }, [loginResult]);

  return (
    <>
      <Provider store={store}>
        <Drawer
          open={drawerOpen}
          side={<Sidebar />}
          onClickOverlay={toggleDrawer}
          mobile
        >
          <Navbar className="p-3">
            <Navbar.Start className="space-x-3">
              <Button color="ghost" onClick={toggleDrawer} className="lg:hidden">
                <FaBars />
              </Button>
              <Link to="/">
                <h1 className="text-2xl font-extrabold">POS App</h1>
              </Link>
            </Navbar.Start>
            <Navbar.End>
              <ToggleDark />
            </Navbar.End>
          </Navbar>
          <main className="p-5">
            <Outlet />
          </main>
        </Drawer>
      </Provider>
    </>
  );
}

export default App;
