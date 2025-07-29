export default function SearchQuery() {
  return (
    <div className="bg-[#009688] grid grid-cols-[49.36%_49.36%] gap-4 p-8 px-12 w-full mt-[6rem]">
      <div className="rounded-2xl">
        <input
          className="w-full bg-[#fff] py-2 px-6 border-none outline-none rounded-lg"
          placeholder="Search for products, vendors and categories..."
          type="text"
        />
      </div>

      <div className="w-full gap-4 flex">
        <select className="w-[50%] py-2 px-4 outline-none rounded-lg">
          <option value="categories">Choose category</option>
          <option value="categories">Groceries</option>
        </select>

        <select className="w-[50%] py-2 px-4 outline-none rounded-lg">
          <option value="categories">Filter</option>
          <option value="categories">Groceries</option>
        </select>
      </div>
    </div>
  );
}
