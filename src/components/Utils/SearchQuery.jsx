import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../supabase-client";
import { useProduct } from "../Context/ProductProvider";

export default function SearchQuery({ setLoading }) {
  const { register, watch } = useForm();
  const [allProducts, setAllProducts] = useState([]);
  const searchQuery = watch("search", "");
  const { setProducts } = useProduct();

  useEffect(() => {
    async function fetchAllProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("products").select("*");

        if (error) {
          console.log("Error fetching products:", error.message);
          return;
        }

        if (data && data.length > 0) {
          setAllProducts(data);
          setProducts(data); // Initially show all products
        }
      } catch (err) {
        console.log("Unexpected error:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === "") {
      setProducts(allProducts);
    } else {
      // Filter products based on search query
      const filteredProducts = allProducts.filter(
        (product) =>
          // Search in product name, description, and category
          product.item_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.item_category
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setProducts(filteredProducts);
    }
  }, [searchQuery, allProducts]);
  return (
    <div className="bg-[#009688] sticky top-20 grid grid-cols-[80%_18%] md:grid-cols-[49.36%_49.36%] gap-4 p-6 px-4 md:px-12 w-full mt-[6rem] z-10">
      <div className="rounded-2xl">
        <input
          {...register("search")}
          className="w-full bg-[#fff] py-2 px-6 border-none outline-none rounded-lg"
          placeholder="Search for products, vendors and categories..."
          type="text"
        />
      </div>

      <div className="w-full gap-4 flex">
        <select className="w-full md:w-[50%] py-2 px-4 outline-none rounded-lg">
          <option value="categories">Choose category</option>
          <option value="categories">Groceries</option>
        </select>

        <select className="hidden md:inline w-[50%] py-2 px-4 outline-none rounded-lg">
          <option value="categories">Filter</option>
          <option value="categories">Groceries</option>
        </select>
      </div>
    </div>
  );
}
