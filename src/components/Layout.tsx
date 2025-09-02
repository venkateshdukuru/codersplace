import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;