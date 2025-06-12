import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-gray-100 text-sm mt-24">
      {/* TOP */}
      <div className="flex flex-col md:flex-row justify-between gap-24">
        {/* LEFT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <Link href="/">
            <span className="text-2xl tracking-wide font-bold">VMH</span>
          </Link>
          <p>
            204 Bells Lane Hoo Rochester England ME3 9GD
          </p>
          <span className="font-semibold">vhmconstructionltd@gmail.com</span>
          <span className="font-semibold">+44 7342 106747</span>
        </div>
        {/* CENTER */}
        <div className="hidden lg:flex justify-between w-1/6">
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">COMPANY</h1>
            <div className="flex flex-col gap-6">
              <Link href="/about-us">About Us</Link>
              <Link href="/legal-privacy">Legal & Privacy</Link>
              <Link href="/contact-us">Contact Us</Link>
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8 items-center">
          <span className="font-semibold text-center">Secure Payments</span>
          <div className="flex justify-between w-full max-w-[140px]">
            <Image src="/paypal.png" alt="PayPal" width={40} height={24} />
            <Image src="/mastercard.png" alt="Mastercard" width={40} height={24} />
            <Image src="/visa.png" alt="Visa" width={40} height={24} />
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-16 border-t pt-8">
        <div>© 2025 VHM Shop</div>
        <div className="flex flex-col gap-8 md:flex-row">
          <div>
            <span className="text-gray-500 mr-4">Currency</span>
            <span className="font-medium">€ GBP</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;