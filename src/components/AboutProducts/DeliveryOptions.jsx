export default function DeliveryOptions() {
  return (
    <div className="bg-[#E5E5E5] w-[45%] p-8">
      <div className="mb-4">
        <h2 className="text-[1.25rem] font-semibold mb-2">Delivery</h2>
        <p>Delivery will be ready in 3 days, thank you for your patience!</p>
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
        <div className="flex gap-8">
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
        <h4 className="text-[1.25rem] font-semibold">Seller's Performance</h4>

        <div className="space-y-4 mt-8">
          <div className="w-[80%] flex items-center justify-between">
            <p>Sales Rate</p>
            <p>70%</p>
          </div>

          <div className="w-[80%] flex items-center justify-between">
            <p>Number of Sales</p>
            <p>302</p>
          </div>

          <div className="w-[80%] flex items-center justify-between">
            <p>Delivery Rate</p>
            <p>80%</p>
          </div>

          <div className="w-[80%] flex items-center justify-between">
            <p>Top Ratings</p>
            <div className="flex gap-2">
              4.5
              <div className="flex gap-1">
                <img src="/images/Star.svg" alt="rating" />
                <img src="/images/Star.svg" alt="rating" />
                <img src="/images/Star.svg" alt="rating" />
                <img src="/images/Star.svg" alt="rating" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
