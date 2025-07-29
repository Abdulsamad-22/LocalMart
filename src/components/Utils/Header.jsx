export default function Header() {
  return (
    <header className="w-full bg-[#808080] fixed h-20 inset-0 shadow-lg shadow-gray-400/50 p-8 z-20">
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-full border-2 border-[#000]"></div>

        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-[#000]"></div>

          <div className="w-8 h-8 rounded-full border-2 border-[#000]"></div>

          <div className="w-8 h-8 rounded-full border-2 border-[#000]"></div>
        </div>
      </div>
    </header>
  );
}
