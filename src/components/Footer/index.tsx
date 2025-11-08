import { FaFacebookF } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

function Footer() {
  return (
    <footer className="text-white py-12">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 px-4">
        <a
          href="https://www.facebook.com/share/1Ee89PnAP6/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transform hover:scale-110 transition-all duration-300 shadow-lg"
        >
          <FaFacebookF className="w-5 h-5 text-black" />
        </a>

        <a
          href="https://chat.whatsapp.com/JfCDyoWuKQu2caJeTTM9g9?mode=ems_copy_t"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-100 p-3 rounded-full hover:bg-green-200 transform hover:scale-110 transition-all duration-300 shadow-lg"
        >
          <FaWhatsapp className="w-5 h-5 text-black" />
        </a>

        <a
          href="tel:+201150090599"
          className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transform hover:scale-110 transition-all duration-300 shadow-lg"
        >
          <FaPhone className="w-5 h-5 text-black" />
        </a>

        <a
          href="https://www.instagram.com/rizk_hairshop?igsh=dzJ0Nm95Ymt2Znl0&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-pink-100 p-3 rounded-full hover:bg-pink-200 transform hover:scale-110 transition-all duration-300 shadow-lg"
        >
          <FaInstagram className="w-5 h-5 text-black" />
        </a>

        <a
          href="https://www.tiktok.com/@rizk_hairshop?_t=ZS-8zPzXoRNWTK&_r=1"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#ff0050]/20 p-3 rounded-full hover:bg-[#ff0050]/30 transform hover:scale-110 transition-all duration-300 shadow-lg"
        >
          <FaTiktok className="w-5 h-5 text-black" />
        </a>
      </div>

      {/* 🔹 هنا نضيف مساحة فاصلة واضحة */}
      <div className="mt-[100px]">
        <p className="text-center text-sm text-gray-800">
          Designed & Developed by{" "}
          <a
            href="https://www.linkedin.com/in/ali-sayed-aa23011bb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-black-300 font-semibold transition-colors underline"
          >
            Ali Sayed
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
