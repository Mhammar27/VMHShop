"use client";

import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ items }: { items: any }) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="">
      {/* Main Image */}
      <div className="h-[500px] relative bg-white">
        <Image
          src={items[index].image?.url}
          alt=""
          fill
          sizes="50vw"
          className="object-contain rounded-md" // 👈 changed from 'object-cover' to 'object-contain'
        />
      </div>

      {/* Thumbnails Scrollable Row */}
      <div className="flex gap-4 mt-4 overflow-x-auto pr-4 scroll-snap-x snap-mandatory scrollbar-hide">
        {items.map((item: any, i: number) => (
          <div
            className="w-24 h-24 relative shrink-0 cursor-pointer snap-start"
            key={item._id}
            onClick={() => setIndex(i)}
          >
            <Image
              src={item.image?.url}
              alt=""
              fill
              sizes="30vw"
              className={`object-cover rounded-md ${
                index === i ? "ring-2 ring-pink-400" : ""
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
