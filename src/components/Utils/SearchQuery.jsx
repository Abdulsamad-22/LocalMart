export default function SearchQuery() {
  return (
    <div className="bg-[#808080] grid grid-cols-[48%_25%_25%] gap-4 p-8 w-full mt-[6rem]">
      <div className="rounded-2xl">
        <input
          className="w-full bg-[#fff] py-2 px-6 border-none outline-none rounded-lg"
          placeholder="Search for products, vendors and categories..."
          type="text"
        />
      </div>

      <select className="px-4 outline-none rounded-lg">
        <option value="categories">Choose category</option>
        <option value="categories">Groceries</option>
      </select>

      <select className="px-4 outline-none rounded-lg">
        <option value="categories">Filter</option>
        <option value="categories">Groceries</option>
      </select>
    </div>
  );
}
