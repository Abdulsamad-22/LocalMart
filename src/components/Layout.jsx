import { Outlet } from "react-router-dom";
import Footer from "./Utils/footer/Footer";
import Header from "./Utils/Header";
import SearchQuery from "./Utils/SearchQuery";
import ScrollToTop from "./Utils/ScrollToTop";

export default function Layout({
  vendorSubmitting,
  setResults,
  results,
  setLoading,
}) {
  return (
    <ScrollToTop>
      <div className="min-h-screen flex flex-col">
        <Header vendorSubmitting={vendorSubmitting} />
        <SearchQuery setLoading={setLoading} />
        <main className="flex-grow my-6 md:my-12 px-4 md:px-12">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ScrollToTop>
  );
}

export function MinimalLayout({ vendorSubmitting }) {
  return (
    <ScrollToTop>
      <div className="min-h-screen">
        <Header vendorSubmitting={vendorSubmitting} />
        <main className="flex-grow my-4 md:my-12">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ScrollToTop>
  );
}
