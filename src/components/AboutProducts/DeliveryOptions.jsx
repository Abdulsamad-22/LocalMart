export default function DeliveryOptions() {
  return (
    <div className="bg-[#EEEEEE] w-full md:w-[35%] p-[1.25rem] rounded-md">
      <div className="mb-4">
        <h3 className="text-[1.25rem] font-semibold mb-2">Delivery</h3>
        <p className="text-[#565454]">
          Delivery will be ready in 3 days, thank you for your patience!
        </p>
      </div>

      <div className="space-x-2 mb-2">
        <input className="w-4 h-4" type="checkbox" />
        <label>Delivery by dispatch</label>
      </div>

      <div className="space-x-2">
        <input className="w-4 h-4" type="checkbox" />
        <label>Schedule delivery method</label>
      </div>

      <div className="my-8">
        <h3 className="text-[1.25rem] font-semibold">Sales Information</h3>
        <div className="flex gap-8 mt-4">
          <div>
            Al resins
            <div className="flex items-center text-[1rem] mt-3">
              <div className="h-4 md:h-8  w-4 md:w-8 bg-[#B7FDF6] text-[0.875rem] md:text-[1.125rem] rounded-full flex items-center justify-center mr-2">
                B
              </div>
              View vendor's store
            </div>
          </div>

          <div className="flex">
            <div className="h-4 md:h-8  w-4 md:w-8 bg-[#2979FF] text-[0.875rem] md:text-[1.125rem] rounded-full flex items-center justify-center mr-2"></div>
            Chat with vendor
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[1.25rem] font-semibold mb-3">
          Seller's Performance
        </h3>
        <ul className="space-y-4 mt-6">
          <li className="flex justify-between">
            <span className="text-[1rem] text-[#000] basis-1/2 text-left">
              Sales Rate
            </span>
            <span className="text-gray-600 flex-1 text-left">70%</span>
          </li>
          <li className="flex justify-between">
            <span className="text-[1rem] text-[#000] basis-1/2 text-left">
              Number of Sales
            </span>
            <span className="text-gray-600 flex-1 text-left">302</span>
          </li>
          <li className="flex justify-between">
            <span className="text-[1rem] text-[#000] basis-1/2 text-left">
              Delivery Rate
            </span>
            <span className="text-gray-600 flex-1 text-left">80%</span>
          </li>
          <li className="flex justify-between">
            <span className="text-[1rem] text-[#000] basis-1/2 text-left">
              Top Ratings
            </span>
            <div className="flex flex-1 text-left text-[1rem] text-gray-600">
              4.5
              <span className="text-gray-600 flex ml-1">
                <img src="/images/Star.svg" alt="rating" />
                <img src="/images/Star.svg" alt="rating" />
                <img src="/images/Star.svg" alt="rating" />
                <img src="/images/Star.svg" alt="rating" />
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
