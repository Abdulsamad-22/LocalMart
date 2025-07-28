import { Outlet } from "react-router-dom";
import Footer from "./Utils/footer/Footer";
import Header from "./Utils/Header";
import SearchQuery from "./Utils/SearchQuery";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SearchQuery />
      <main className="flex-grow my-12 px-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
