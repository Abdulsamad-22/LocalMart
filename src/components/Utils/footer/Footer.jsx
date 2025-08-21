import {
  Phone,
  EnvelopeSimple,
  MapPin,
  LinkedinLogo,
  XLogo,
  InstagramLogo,
  FacebookLogo,
} from "@phosphor-icons/react";
const footerLinks = [
  {
    header: "Company",
    links: ["About Us", "Blog", "Contact Us", "Career"],
  },
  {
    header: "Customer Services",
    links: ["My Account", "Track Your Order", "Return", "FAQ"],
  },
  {
    header: "Our Information",
    links: [
      "Privacy",
      "User terms & Condition",
      "Help & Support",
      "Return Policy",
    ],
  },
  {
    header: "Contact Info",
    links: [
      { link: "+234 (0) 811-1642-890", icon: <Phone size={24} /> },
      {
        link: "abdulsamadhussaini001@gmail.com",
        icon: <EnvelopeSimple size={24} />,
      },
      {
        link: "Ushafa Township Stadium, Ushafa, Bwari, Abuja",
        icon: <MapPin size={24} />,
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#005349] py-12 px-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0  mb-8 text-[#fff]">
        <div className="flex flex-col items-start gap-2 mb-2">
          <div className=" rounded-full relative mb-4">
            <h4 className="text-[1.5rem] font-semibold">LocalMart</h4>

            <p className="w-60 text-[0.875rem] font-regular">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
              quasi dolorem facilis? Aspernatur, natus rerum possimus provident
            </p>
          </div>

          <div>
            <ul className="flex gap-3">
              <a>
                <FacebookLogo size={24} />
              </a>

              <a href="https://www.linkedin.com/in/abdulsamad-hussaini-481657283/">
                <LinkedinLogo size={24} />
              </a>

              <a href="https://x.com/_Hoossayn">
                <XLogo size={24} />
              </a>

              <a href="">
                <InstagramLogo size={24} />
              </a>

              <a>
                <EnvelopeSimple size={24} />
              </a>
            </ul>
          </div>
        </div>

        <div className=" flex flex-col md:flex-row items-start  justify-around w-[80%]">
          {footerLinks.map((section, index) => (
            <div key={index} className="mb-8 space-y-4">
              <h6 className="text-[1.25rem] font-semibold mb-2">
                {section.header}
              </h6>
              <ul className="space-y-4 md:space-y-4">
                {Array.isArray(section.links) &&
                  section.links.map((item, i) => (
                    <li key={i} className="text-[1rem] text-[#E4E1FB]">
                      {typeof item === "string" ? (
                        item
                      ) : (
                        <div className="flex gap-2">
                          <span>{item.icon}</span> {item.link}
                        </div>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-[0.875rem] md:text-[1rem] text-[#fff]">
        <div className="flex justify-center items-center h-6 w-6 p-4 rounded-full border-2 border-[#c4c4c4] text-center">
          C
        </div>
        LocalMart. All Right Reserved
      </div>
    </footer>
  );
}
