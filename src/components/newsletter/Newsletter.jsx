export default function Newsletter() {
  return (
    <section className="bg-[#020C0B] p-12 rounded-3xl mt-12">
      <div className="w-full md:w-[50%] lg:w-[40%] text-center md:text-left">
        <h4 className="text-[#fff] text-[1.25rem] md:text-[1.5rem] mb-8">
          Ready to get update on rising products and best sellers around you?
        </h4>
        <div className="flex bg-[#fff] py-2 px-2 rounded-full">
          <input
            className="w-full py-2 pr-3 border-none outline-none rounded-full"
            placeholder="Enter Email"
            type="text"
          />
          <button className="w-[195px] bg-gradient-to-r from-[#009688] to-[#00695C] text-[1rem] text-[#fff] rounded-full py-2 px-4">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
