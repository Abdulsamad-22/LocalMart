import { Link } from "react-router-dom";
import { ShoppingCart, Truck, Heart, CurrencyNgn } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useCart } from "../Context/CartProvider";
import { useWishlist } from "../Context/WishlistProvider";
import { supabase } from "../../supabase-client";
import { useProduct } from "../Context/ProductProvider";

export default function ProductsDisplay({ limit }) {
  const { handleAddToCart } = useCart();
  const { addToWishlist, isInWishList } = useWishlist();
  const [loading, setLoading] = useState(true);
  const { products, setProducts, vendors } = useProduct();

  console.log(vendors);
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
        const { data, error } = await supabase.from("products").select("*");
        if (error) {
          console.log("Error fetching products", error);
        } else {
          console.log("Fetched products:", data);
          setProducts(data);
          // Cache the fetched products
          localStorage.setItem("cachedProducts", JSON.stringify(data));
        }
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
      <div>
        <p>Loading available products...</p>
        <p>
          <small>This may take a few moments</small>
        </p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 px-0 md:px-0">
      {products.slice(0, limit || 12).map((product, id) => {
        const isWishlisted = isInWishList(product.id.toString());
        // const vendor = vendors.find(
        //   (v) => v.vendor_id.toString() === product.vendor_id.toString()
        // );
        return (
          <div
            key={id}
            className="bg-[#fff] shadow-lg shadow-gray-400/50 rounded-[10px]"
          >
            <div className="w-full md:w-full h-auto md:h-[218px] relative transition-transform duration-300 hover:scale-95 cursor-pointer">
              <Link to={`/products/${product.id.toString()}`}>
                <img
                  className="w-full h-full rounded-[10px]"
                  src={product.image_url}
                  alt="products image"
                />
              </Link>

              <Heart
                onClick={() =>
                  addToWishlist({ ...product, id: product.id.toString() })
                }
                size={24}
                weight={isWishlisted ? "fill" : "regular"}
                className="absolute right-2 top-2 text-[#009688]"
              />
            </div>

            <div className="bg-[#fff] px-3 py-4 space-y-3 rounded-b-[10px]">
              <h2 className="font-semibold text-[0.875rem] md:text-[1rem] text-gray-900 line-clamp-1">
                {product.item_name}
              </h2>
              <div className="space-y-2 md:space-y-4">
                <div className="flex items-center">
                  <div className="h-4 md:h-8  w-4 md:w-8 bg-[#B7FDF6]  rounded-full flex items-center justify-center mr-2">
                    A
                  </div>
                  {vendors.map((v) => (
                    <span className="font-medium line-clamp-1">{v.name}</span>
                  ))}
                  {/* <span>{vendor.name}</span> */}
                </div>
                <div className="flex items-center gap-1">
                  <img
                    src="/images/Star.svg"
                    alt="Rating"
                    className="w-4 h-4"
                  />
                  <span className="font-medium">4.5</span>
                  <span className="text-xs font-normal">(120 reviews)</span>
                </div>

                <div className="space-y-2">
                  <span className="flex items-center font-semibold text-[1rem] md:text-[1.125rem] text-gray-900">
                    <CurrencyNgn size={18} className="mr-1" />
                    {Number(product.item_price).toLocaleString("en-NG")}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck size={18} />
                    <span>
                      {vendors.map((v) => (
                        <span>{v.travelTime || "N/A"}</span>
                      ))}
                      {/* <span>{vendor.travelTime}</span> */}
                      mins away
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <button
                  onClick={() =>
                    handleAddToCart({ ...product, id: product.id })
                  }
                  className="flex items-center justify-center gap-2 w-full text-[0.875rem] md:text-[1rem] px-4 md:px-5 py-2 md:py-2 bg-gradient-to-r from-[#009688] to-[#00695C] text-[#fff] item-center rounded-lg mt-2 md:mt-4"
                >
                  <ShoppingCart size={24} color="#fff" />
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
