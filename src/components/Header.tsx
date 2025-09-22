// components/Header.tsx
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full max-w-screen-md flex items-center justify-between">
      <div className="flex-shrink-0">
        <Image
          src="/images/bison.png" 
          alt="Logo"
          width={56}
          height={52}
          className="object-contain"
          priority
        />
      </div>

      <div className="text-right text-sm">
        <p>Available</p>
        <p>0.12345678 BTC</p>
        <p>224,01 €</p>
      </div>
    </header>
  );
}
