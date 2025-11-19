import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Truck,
  Heart,
  MapPin,
  CurrencyNgn,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useCart } from "../Context/CartProvider";
import { useWishlist } from "../Context/WishlistProvider";
import { useProduct } from "../Context/ProductProvider";
import { useVendorLocation } from "../Context/deliveryTime/VendorLocationProvider";

export default function ProductsDisplay({ limit, loading: searchLoad }) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishList } = useWishlist();
  const [loading, setLoading] = useState(true);
  const { products, setProducts } = useProduct();
  const { vendors } = useVendorLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Check if products are cached in localStorage
        const cachedProducts = localStorage.getItem("cachedProducts");
        if (cachedProducts) {
          setProducts(JSON.parse(cachedProducts));
          setLoading(false);
          return; // Skip fetch if cached
        }

        // Fetch from database if no cache
        // const { data, error } = await supabase.from("products").select("*");
        // if (error) {
        //   console.log("Error fetching products", error);
        // } else {
        //   console.log("Fetched products:", data);
        //   setProducts(data);
        //   // Cache the fetched products
        //   localStorage.setItem("cachedProducts", JSON.stringify(data));
        // }
      } catch (err) {
        console.error("Error fetching available products", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p>Loading available products...</p>
        <p>
          <small>This may take a few moments</small>
        </p>
      </div>
    );
  }

  if (searchLoad)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading products...</p>
      </div>
    );

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-4 gap-y-8 md:gap-y-12 px-0 md:px-0">
      {products.length > 0
        ? products.slice(0, limit).map((product) => {
            const isWishlisted = isInWishList(product.id.toString());
            const vendor = vendors.find((v) => v.id === product.vendor_id);
            return (
              <div
                key={product.id}
                className="bg-[#fff] border shadow-sm hover:shadow-md transition-shadow rounded-[4px] md:rounded-[10px]"
              >
                <div className="w-full md:w-full h-[8.5rem] md:h-[218px] relative cursor-pointer">
                  <Link to={`/products/${product.id.toString()}`}>
                    <img
                      className="w-full h-full rounded-t-[4px] md:rounded-t-[10px]"
                      src={product.image_url}
                      alt="products image"
                    />
                  </Link>

                  <Heart
                    onClick={() =>
                      addToWishlist({ ...product, id: product.id.toString() })
                    }
                    weight={isWishlisted ? "fill" : "regular"}
                    className="absolute right-2 top-2 text-[#009688] text-[1.25rem] md:[1.5rem]"
                  />
                </div>

                <div className="bg-[#fff] px-3 py-3 space-y-[6px] md:space-y-3 rounded-b-[8px] md:rounded-b-[10px]">
                  <h2 className="md:font-semibold text-[0.875rem] md:text-[1rem] text-gray-900 line-clamp-1">
                    {product.item_name}
                  </h2>
                  <div className="space-y-2 md:space-y-4">
                    <div className="hidden md:flex items-center">
                      <div className="h-6 md:h-8  w-6 md:w-8 text-[0.875rem] md:text-[1rem] bg-[#B7FDF6]  rounded-full flex items-center justify-center mr-2">
                        {vendor?.name?.[0]?.toUpperCase() || ""}
                      </div>
                      <span className="text-[0.875rem] md:text-[1rem] line-clamp-1">
                        {vendor?.name || ""}
                      </span>
                    </div>
                    <div className="hidden md:flex items-center gap-1">
                      <img
                        src="/images/Star.svg"
                        alt="Rating"
                        className="w-4 h-4"
                      />
                      <span className="font-medium">4.5</span>
                      <span className="text-xs font-normal">(120 reviews)</span>
                    </div>

                    <div className="space-y-[3px] md:space-y-2 text-center">
                      <span className="flex items-center font-medium md:font-semibold text-[0.75rem] md:text-[1rem] text-gray-900">
                        <CurrencyNgn className="mr-[0.5px] font-semibold text-[1rem] md:text-[1.25rem]" />
                        {Number(product.item_price).toLocaleString("en-NG")}
                      </span>
                      <div className="flex items-center gap-[2px] md:gap-[2px] text-[0.75rem] md:text-[0.875rem] text-gray-600">
                        {vendor?.travelTime ? (
                          <Truck className="text-[1rem] md:text-[1.125rem]" />
                        ) : (
                          <MapPin className="text-[1rem] md:text-[1.125rem]" />
                        )}
                        <span>
                          {vendor?.travelTime
                            ? vendor.travelTime >= 60
                              ? `${(vendor.travelTime / 60).toFixed(
                                  1
                                )} hrs away`
                              : `${vendor.travelTime} mins away`
                            : vendor?.address || "Location not available"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <button
                      onClick={() => addToCart({ ...product, id: product.id })}
                      className="flex items-center justify-center gap-2 w-full text-[0.875rem] md:text-[1rem] px-4 md:px-5 py-2 md:py-2 bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
                    hover:from-[#00897B] hover:to-[#005B4F] text-[#fff] rounded-[8px] mt-2 md:mt-4"
                    >
                      <ShoppingCart size={24} color="#fff" />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        : !searchLoad && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">
                {/* {searchQuery
                    ? "No products found matching your search."
                    : "No products available."} */}
              </p>
            </div>
          )}
    </section>
  );
}
