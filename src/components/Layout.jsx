import { Outlet } from "react-router-dom";
import Footer from "./Utils/footer/Footer";
import Header from "./Utils/Header";
import SearchQuery from "./Utils/SearchQuery";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SearchQuery />
      <main className="flex-grow my-6 md:my-12 px-4 md:px-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function MinimalLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex-grow my-4 md:my-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
