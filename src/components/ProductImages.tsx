"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductImages = ({ items }: { items: any }) => {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
    scrollRef.current.scrollTo({
      left: scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {/* Main Image */}
      <div className="h-[500px] relative bg-white">
        <Image
          src={items[index].image?.url}
          alt=""
          fill
          sizes="50vw"
          className="object-contain rounded-md"
        />
      </div>

      {/* Thumbnails Carousel */}
      <div className="relative mt-4">
        {/* Left Arrow */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow-md"
          onClick={() => scroll("left")}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Scrollable Thumbnails */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pr-8 pl-8 scroll-snap-x snap-mandatory scrollbar-hide"
        >
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

        {/* Right Arrow */}
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow-md"
          onClick={() => scroll("right")}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default ProductImages;
