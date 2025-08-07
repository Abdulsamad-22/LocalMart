import { useForm } from "react-hook-form";

export default function SearchQuery() {
  const { register } = useForm();
  return (
    <div className="bg-[#009688] sticky top-20 grid grid-cols-[80%_18%] md:grid-cols-[49.36%_49.36%] gap-4 p-6 px-4 md:px-12 w-full mt-[6rem] z-10">
      <div className="rounded-2xl">
        <input
          {...register}
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
