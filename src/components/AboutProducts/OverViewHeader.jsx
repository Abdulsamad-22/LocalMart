export default function OverviewHeader() {
  return (
    <div className="bg-[#D7D7D7] flex items-center gap-6 md:gap-12 py-3 md:py-4 px-4 md:px-4 mb-12 rounded-lg">
      <div className="text-[1rem] md:text-[1.25rem] transition-transform duration-300 hover:text-[#009688] cursor-pointer">
        Overview
      </div>

      <div className="text-[1rem] md:text-[1.25rem] transition-transform duration-300 hover:text-[#009688] cursor-pointer">
        Description
      </div>

      <div className="text-[1rem] md:text-[1.25rem] transition-transform duration-300 hover:text-[#009688] cursor-pointer">
        Vendor's Store
      </div>

      <div className="text-[1rem] md:text-[1.25rem] transition-transform duration-300 hover:text-[#009688] cursor-pointer">
        Reviews
      </div>
    </div>
  );
}
