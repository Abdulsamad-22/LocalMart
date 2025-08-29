import products from "../../../data/Products.json";
import { Link } from "react-router-dom";
import { ShoppingCart, Truck, Heart, CurrencyNgn } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useCart } from "../Context/CartProvider";
import { useWishlist } from "../Context/WishlistProvider";
import { supabase } from "../../supabase-client";
import { useProduct } from "../Context/ProductProvider";
const productListings = products;

export default function ProductsDisplay({ limit }) {
  const { handleAddToCart } = useCart();
  const { addToWishlist, isInWishList } = useWishlist();
  const [loading, setLoading] = useState(true);
  const { products, setProducts, vendors } = useProduct();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*");
        if (error) {
          console.log("Error fetching products", error);
        }
        console.log("Fetched products:", data);
        setProducts(data);
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
      {products.slice(0, limit || products.length).map((product, id) => {
        const isWishlisted = isInWishList(product.id.toString());
        const vendor = vendors.find((v) => v.id === product.vendor_id);
        console.log(vendor);
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
                onClick={() => addToWishlist({ ...product, id: product.id })}
                size={24}
                weight={isWishlisted ? "fill" : "regular"}
                className="absolute right-2 top-2 text-[#009688]"
              />
            </div>

            <div className="bg-[#fff] px-3 py-4 space-y-3 rounded-b-[10px]">
              <h2 className="font-medium text-gray-900">{product.item_name}</h2>
              <div className="space-y-2 md:space-y-4">
                <div className="flex items-center">
                  <div className="h-4 md:h-8  w-4 md:w-8 bg-[#B7FDF6]  rounded-full flex items-center justify-center mr-2">
                    A
                  </div>
                  {vendors.map((v) => (
                    <span>{v.name}</span>
                  ))}
                </div>
                <div className="flex items-center">
                  <img src="/images/Star.svg" alt="" />
                  <div className="text-[0.875rem] font-semibold">
                    4.5
                    <span className="text-[0.75rem] md:text-[0.875rem] font-[400] pl-1">
                      {`(120 reviews)`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center  font-semibold ">
                    <CurrencyNgn size={20} />
                    {Number(product.item_price).toLocaleString("en-NG")}
                  </span>
                  <div className="flex items-center gap-[4px] text-gray-600">
                    <Truck size={24} className="" />
                    <p className="text-sm ">
                      {vendors.map((v) => (
                        <span>{v.travelTime}</span>
                      ))}
                      mins away
                    </p>
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
