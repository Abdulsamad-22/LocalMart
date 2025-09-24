import {
  Heart,
  ShoppingCart,
  X,
  Star,
  CurrencyNgn,
  Funnel,
  CaretDown,
} from "@phosphor-icons/react";
import { useWishlist } from "../Context/WishlistProvider";
import { useCart } from "../Context/CartProvider";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearAllWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.item_price - b.item_price;
      case "price-high":
        return b.item_price - a.item_price;
      case "name":
        return a.item_name.localeCompare(b.item_name);
      default:
        return new Date(b.addedDate) - new Date(a.addedDate);
    }
  });

  // Add all wishlist item to cart
  const addAllToCart = (items) => {
    addToCart(items);
    alert("All saved items have been added to cart");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-[0.5px] border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">
                {sortedItems.length} items saved
              </p>
            </div>

            {/* Sort and Filter Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Funnel size={16} />
                <span className="text-sm font-medium">Filters</span>
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#009688]"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
                <CaretDown
                  size={16}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="">
        {sortedItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart size={64} className="text-gray-300 mx-auto mb-[1px]" />
            <h2 className="text-xl font-semibold text-gray-900 mb-[1px]">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Save items you love to buy them later
            </p>
            <Link
              to="/"
              className="bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
    hover:from-[#00897B] hover:to-[#005B4F] text-[#fff] px-6 py-[0.75rem] rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Wishlist Items */
          <div className="bg-white">
            {sortedItems.map((item) => (
              <div key={item.id} className="border-b-[0.5px] border-gray-100">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.item_name}
                        className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                        <div className="flex-1">
                          {/* Product Name & Brand */}
                          <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                            {item.item_name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.item_description}
                          </p>
                          {/* <div className="flex items-center gap-4 mb-3">
                            <span className="text-sm text-gray-500">by {item.vendor}</span>
                          </div> */}

                          {/* Rating & Reviews */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-[0.5px]">
                              <Star
                                weight="fill"
                                className="text-yellow-400"
                                size={20}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              4.5
                            </span>
                            <span className="text-sm text-gray-500">
                              (120 reviews)
                            </span>
                          </div>

                          {/* Availability */}
                          <div className="flex items-center gap-2 mb-4">
                            <span
                              className={`inline-block w-2 h-2 rounded-full ${
                                item.item_units > 0
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></span>
                            <span
                              className={`text-sm font-medium ${
                                item.item_units > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {item.item_units > 0
                                ? "In Stock"
                                : "Out of Stock"}
                            </span>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex flex-col sm:items-end gap-4 sm:min-w-[200px]">
                          {/* Price */}
                          <div className="text-right">
                            <div className="flex items-center text-[1.25rem] font-medium text-gray-900">
                              <CurrencyNgn size={18} />
                              {Number(item.item_price).toLocaleString("en-NG")}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-4 w-full sm:w-[9em]">
                            <button
                              onClick={() => addToCart(item)}
                              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
    hover:from-[#00897B] hover:to-[#005B4F] text-[#fff] px-4 py-[0.75rem] rounded-lg transition-colors"
                            >
                              <ShoppingCart size={18} />
                              Add to Cart
                            </button>
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-[0.625rem] rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <X size={18} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bulk Actions Footer */}
        {sortedItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border mt-6 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600">
                {sortedItems.length} item
                {sortedItems.length !== 1 ? "s" : ""} in your wishlist
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => addAllToCart(wishlistItems)}
                  className="bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
    hover:from-[#00897B] hover:to-[#005B4F] text-[#fff] px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Add All to Cart
                </button>
                <button
                  onClick={() => clearAllWishlist()}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Clear Wishlist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
