import {
  Plus,
  ShoppingCart,
  Minus,
  Truck,
  Star,
  ShareNetwork,
  Heart,
  ArrowCounterClockwise,
  ThumbsUp,
  ChatCircleDots,
  Check,
  Shield,
  CaretLeft,
  CaretRight,
  CurrencyNgn,
} from "@phosphor-icons/react";
import { useCart } from "../Context/CartProvider";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductsCard({ product, vendorInfo }) {
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  // const [selectedStorage, setSelectedStorage] = useState(
  //   product.variants.storage[1]
  // );
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const tempRating = 4.5;
  const reviewCount = 3442;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        weight={index < Math.floor(rating) ? "fill" : "regular"}
        className={
          index < Math.floor(rating) ? " text-yellow-400" : "text-gray-300"
        }
      />
    ));
  };

  const [reviews] = useState([
    {
      id: 1,
      user: "John D.",
      rating: 5,
      date: "2 weeks ago",
      verified: true,
      comment:
        "Amazing phone! The camera quality is exceptional and the S Pen is incredibly useful.",
      helpful: 12,
    },
    {
      id: 2,
      user: "Sarah M.",
      rating: 4,
      date: "1 month ago",
      verified: true,
      comment:
        "Great performance and battery life. Only minor issue is it's a bit heavy.",
      helpful: 8,
    },
    {
      id: 3,
      user: "Mike R.",
      rating: 5,
      date: "3 weeks ago",
      verified: true,
      comment: "Best Android phone I've ever used. The display is stunning!",
      helpful: 15,
    },
  ]);

  const updateQuantity = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.item_units) {
      setQuantity(newQuantity);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-2 md:px-8">
        <div className="max-w-7xl mx-auto px-0 md:px-3 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[30em_1fr] gap-4 md:gap-20 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
                <img
                  // src={product.images[selectedImage]}
                  src={product.image_url}
                  alt={product.item_name}
                  className="w-[30em] md:w-[30em] md:h-[450px] object-cover "
                  // className="w-full h-96 sm:h-[500px] object-cover"
                />

                {/* Image Navigation */}
                {/* <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                >
                  <CaretLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                >
                  <CaretRight size={20} />
                </button> */}
              </div>

              {/* Thumbnail Images */}
              {/* <div className="flex space-x-2 overflow-x-auto">
                {product.image_url.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>*/}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Product Title & Rating */}
              <div>
                {/* <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium text-blue-600 hover:underline cursor-pointer">{product.brand}</span>
              </div> */}
                <div className="text-sm text-gray-400 mb-1">
                  <span>{product.item_category}</span>
                </div>

                <h2 className="text-[1rem] md:text-[1.25rem] font-semibold text-gray-900">
                  {product.item_name}
                </h2>
                <div className="flex justify-between border-b-[1px] border-dashed border-gray-300 py-2 mb-4">
                  <span className="flex items-center font-semibold text-[1rem] md:text-[1rem]">
                    <CurrencyNgn size={20} />
                    {Number(product.item_price).toLocaleString("en-NG")}
                  </span>

                  <div className="flex items-center gap-1 ">
                    <Star weight="fill" className="text-yellow-400" size={20} />

                    <div className="text-[0.875rem] md:text-[1rem] font-regular">
                      4.5
                    </div>
                  </div>
                </div>
              </div>

              {/*Product description */}

              <div>
                <h3 className="text-gray-900 font-semibold mb-1">
                  Description:
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-4">
                  {product.item_description}
                </p>
              </div>

              {/* Variants */}
              <div>
                <div>
                  {product.item_sizes && product.item_sizes.length > 0 && (
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Sizes:
                    </h3>
                  )}
                </div>
                {product.item_sizes && product.item_sizes.length > 0 && (
                  <select
                    className="w-[20%] px-3 py-2 rounded-lg border 
          border-[#009688] text-gray-700 text-sm
          focus:outline-none
          hover:border-[#00796B] transition-all duration-200 mb-4"
                  >
                    {product.item_sizes.map((size, index) => (
                      <option
                        key={index}
                        value={size}
                        className="
              hover:bg-[#009688]/10 
              active:bg-[#009688] active:text-white
              cursor-pointer
            "
                      >
                        {size}
                      </option>
                    ))}
                  </select>
                )}

                {/* Color */}
                <div>
                  {product.item_colors.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        Choose a color
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.item_colors.map((color) => (
                          <button
                            key={color.code}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 rounded-lg border-2 ${
                              color.name === "White" ||
                              color.name === "Yellow" ||
                              color.name === "Pink"
                                ? "text-[#009688]"
                                : "text-[#fff]"
                            } text-sm font-medium transition-colors ${
                              selectedColor === color
                                ? "border-[#009688] bg-blue-50 text-[#009688]"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            style={{ backgroundColor: color.code }}
                          >
                            {selectedColor === color ? (
                              <Check className="font-semibold" size={18} />
                            ) : (
                              color.name
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      product.item_units > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`font-medium ${
                      product.item_units > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.item_units > 0
                      ? `In Stock (${product.item_units} left)`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4 pt-4 border-t-[1px] border-dashed border-gray-300">
                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">Quantity:</span>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                      className="border border-gray-300 p-[0.35rem] md:p-3 transition-transform duration-300 hover:bg-[#009688] hover:text-white font-semibold rounded-full disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(quantity + 1)}
                      disabled={quantity >= product.item_units}
                      className="border border-gray-300 p-[0.35rem] md:p-3 transition-transform duration-300 hover:bg-[#009688] hover:text-white font-semibold rounded-full disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  {/* <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(quantity + 1)}
                      disabled={quantity >= product.item_units}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div> */}
                  <span className="text-sm text-gray-600">
                    Max: {product.item_units}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() =>
                      addToCart({
                        ...product,
                        id: product.id,
                        quantity: quantity,
                        color: selectedColor,
                      })
                    }
                    disabled={product.item_units < 1}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
                    hover:from-[#00897B] hover:to-[#005B4F] text-[#fff] py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                  <button className="flex-1 border border-gray-400 py-3 px-6 rounded-lg hover:border-[#009688] hover:text-[#009688] transition-colors">
                    Buy Now
                  </button>
                </div>

                {/* Secondary Actions */}
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isWishlisted
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <Heart
                      size={16}
                      className={isWishlisted ? "fill-current" : ""}
                    />
                    {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
                  </button>
                  <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#009688] transition-colors">
                    <ShareNetwork size={16} />
                    Share
                  </button>
                </div>
              </div>

              {/* Delivery & Services */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="text-green-600" size={20} />
                  <div>
                    <div className="font-medium text-gray-900">
                      Free Delivery
                    </div>
                    <div className="text-sm text-gray-600">3-5 days</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowCounterClockwise className="text-blue-600" size={20} />

                  <div>
                    <div className="font-medium text-gray-900">
                      Easy Returns
                    </div>
                    <div className="text-sm text-gray-600">
                      30-days return ploicy
                    </div>
                  </div>
                </div>
                {/* <div className="flex items-center gap-3">
                  <Shield className="text-purple-600" size={20} />
                  <div>
                    <div className="font-medium text-gray-900">
                      Warranty Protection
                    </div>
                    <div className="text-sm text-gray-600">
                      1 year manufacturer warranty
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Seller Info */}
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Sold by</h3>
                  <div className="flex items-center gap-1">
                    {renderStars(tempRating)}
                    <span className="text-sm font-medium ml-1">
                      {/* {product.sellerRating} */}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#009688] hover:underline cursor-pointer">
                      {vendorInfo.name}
                    </div>
                    <div className="text-sm text-gray-600">5k + sold</div>
                  </div>
                  <Link
                    to={`/vendor/${vendorInfo.id}`}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                  >
                    View Store
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="bg-white rounded-lg shadow-sm">
            {/* Tab Navigation */}
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                {["description", "specifications", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-[#009688] text-[#009688]"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab === "description" && "Description"}
                    {tab === "specifications" && "Specifications"}
                    {tab === "reviews" &&
                      `Reviews (${reviewCount.toLocaleString()})`}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "description" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Product Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {product.item_description}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {product.features?.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check
                            size={16}
                            className="text-green-600 flex-shrink-0"
                          />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "specifications" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Technical Specifications
                  </h3>
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex py-3 border-b border-gray-100">
                      <dt className="font-medium text-gray-900 w-1/2">{key}</dt>
                      <dd className="text-gray-700 w-1/2">{value}</dd>
                    </div>
                  ))}
                </div> */}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Review Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Customer Reviews
                      </h3>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl font-bold">{tempRating}</span>
                        <div>
                          <div className="flex items-center mb-1">
                            {renderStars(tempRating)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Based on {reviewCount.toLocaleString()} reviews
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
     text-[#fff] px-6 py-2 rounded-lg font-medium hover:from-[#00897B] hover:to-[#005B4F] transition-colors"
                      >
                        Write a Review
                      </button>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-4 last:border-0"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-[#009688]/20 rounded-full flex items-center justify-center font-semibold text-[#009688]">
                            {review.user.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{review.user}</span>
                              {review.verified && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  Verified Purchase
                                </span>
                              )}
                              <span className="text-sm text-gray-500">
                                {review.date}
                              </span>
                            </div>
                            <div className="flex items-center mb-2">
                              {renderStars(review.rating)}
                            </div>
                            <p className="text-gray-700 mb-3">
                              {review.comment}
                            </p>
                            <div className="flex items-center gap-4">
                              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                                <ThumbsUp size={14} />
                                Helpful ({review.helpful})
                              </button>
                              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                                <ChatCircleDots size={14} />
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
