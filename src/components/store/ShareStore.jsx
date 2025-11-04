import {
  TwitterShareButton,
  FacebookShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterIcon,
  FacebookIcon,
} from "react-share";
import { LinkSimple, X } from "@phosphor-icons/react";
export default function ShareStore({ vendorData, setOpenOverlay }) {
  const shareUrl = `${window.location.origin}/vendor/${vendorData?.vendor_id}`;
  const shareText = `Check out ${vendorData?.business_name}'s store on LocalMart!`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vendorData?.business_name} Store`,
          text: shareText,
          url: shareUrl,
        });
        console.log("Shared successfully");
      } catch (err) {
        console.error("Share canceled or failed:", err);
      }
    }
  };

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  return (
    <>
      <div className="flex justify-between items-center border-b p-2 mb-6">
        <h3 className="font-medium text-[0.875rem] text-gray-800">
          Share this store
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              alert("Shop URL copied to clipboard!");
            }}
            className="flex items-center gap-[0.25rem] text-[0.75rem] text-[#009688]"
          >
            <LinkSimple size={17} />
            Copy store link
          </button>
          <X
            onClick={() => setOpenOverlay(false)}
            className="cursor-pointer"
            size={16}
          />
        </div>
      </div>

      {/* Mobile: Use native share */}
      {isMobile && navigator.share ? (
        <button
          onClick={handleNativeShare}
          className="w-full bg-[#009688] text-white py-2 px-4 rounded-lg hover:bg-[#00796B] transition-colors"
        >
          Share Store
        </button>
      ) : (
        // Desktop: Show social hare icons
        <div className="flex items-center justify-center gap-3">
          <WhatsappShareButton url={shareUrl} title={shareText}>
            <WhatsappIcon size={36} round />
          </WhatsappShareButton>
          <TwitterShareButton url={shareUrl} title={shareText}>
            <TwitterIcon size={36} round />
          </TwitterShareButton>
          <FacebookShareButton url={shareUrl} quote={shareText}>
            <FacebookIcon size={36} round />
          </FacebookShareButton>
        </div>
      )}
    </>
  );
}
