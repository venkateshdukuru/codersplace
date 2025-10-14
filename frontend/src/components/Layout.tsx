//path: frontend/src/components/Layout.tsx

import Footer from "./Footer";
import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;