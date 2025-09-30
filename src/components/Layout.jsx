import { Outlet } from "react-router-dom";
import Footer from "./Utils/footer/Footer";
import Header from "./Utils/Header";
import SearchQuery from "./Utils/SearchQuery";
import ScrollToTop from "./Utils/ScrollToTop";

export default function Layout({ setLoading }) {
  return (
    <ScrollToTop>
      <div className="min-h-screen flex flex-col">
        <Header />
        <SearchQuery setLoading={setLoading} />
        <main className="flex-grow my-6 md:my-12 px-4 md:px-12">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ScrollToTop>
  );
}

export function MinimalLayout() {
  return (
    <ScrollToTop>
      <div className="min-h-screen">
        <Header />
        <main className="flex-grow my-4 md:my-12">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ScrollToTop>
  );
}
