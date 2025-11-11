import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthProvider";
import { supabase } from "../../supabase-client";
import {
  CurrencyNgn,
  PencilSimple,
  ShoppingCart,
  Trash,
} from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { useProduct } from "../Context/ProductProvider";
import { useCart } from "../Context/CartProvider";

export default function VendorShopDisplay({ vendorId, isOwner, currentUser }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { products, setProducts, setEditingProduct, editingProduct } =
    useProduct();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const { data: productData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("vendor_id", vendorId)
          .order("created_at", { ascending: false });

        if (productsError) {
          setError("Error loading products");
          console.error("Product fetch error:", productsError);
          return;
        }

        setProducts(productData || []);
      } catch (err) {
        setError("Something went wrong", err.message);
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (vendorId) {
      fetchProducts();
    }
  }, [vendorId]);

  const handleEditProduct = (product) => {
    // Navigate to edit product page
    setEditingProduct(product);
    navigate("/add-product");
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", productId);

        if (error) throw error;

        // Remove from local state
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        alert("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          {isOwner ? "Your Products" : "Products"} ({products.length})
        </h2>
        {/* {isOwner && (
          <Link
            to="/add-product"
            className="bg-[#009688] text-white px-4 py-2 rounded"
          >
            Add Product
          </Link>
        )} */}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {isOwner
              ? "You haven't added any products yet."
              : "No products available in this shop yet."}
          </p>
          {isOwner && (
            <Link
              to="/add-product"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Add Your First Product
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-[47%_47%] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.item_name}
                  className="w-full md:w-full h-auto md:h-[218px] object-cover"
                />
              )}
              <div className="p-2 md:p-4">
                <h3 className="font-semibold text-[0.875rem] md:text-[1rem] mb-1 md:mb-2 line-clamp-1">
                  {product.item_name}
                </h3>
                {product.item_description && (
                  <p className="text-gray-600 text-[0.75rem] md:text-[0.875rem] mb-3 line-clamp-3">
                    {product.item_description}
                  </p>
                )}
                <div className="flex justify-between items-center mb-3">
                  <span className="flex items-center font-semibold text-[0.875rem] md:text-[1rem]">
                    <CurrencyNgn className="text-[1rem] md:text-[1.18rem]" />
                    {Number(product.item_price || 0).toLocaleString("en-NG")}
                  </span>
                  {product.item_units !== undefined && (
                    <span
                      className={`text-[0.75rem] md:text-[0.875rem] ${
                        product.item_units > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {product.item_units > 0
                        ? `Stock: ${product.item_units}`
                        : "Out of Stock"}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                {!isOwner ? (
                  // Customer view - Add to Cart button
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.item_units === 0}
                    className={`w-full py-2 rounded transition-colors ${
                      product.item_units === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200 hover:from[#00897B] hover:to-[#005B4F] text-[#fff]"
                    }`}
                  >
                    {product.item_units !== 0 ? <ShoppingCart size={20} /> : ""}
                    {product.item_units === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                ) : (
                  // Owner view - Edit/Delete buttons
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex items-center justify-center gap-2 flex-1 bg-red-100 text-red-700 py-2 px-3 rounded text-sm hover:bg-red-200"
                    >
                      <Trash size={18} />
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex items-center justify-center gap-2 flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-blue-50"
                    >
                      <PencilSimple size={18} />
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
