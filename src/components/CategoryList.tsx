import Link from "next/link";
import Image from "next/image";
import { wixClientServer } from "@/lib/wixClientServer";

const CategoryList = async () => {
  const wixClient = await wixClientServer();
  const cats = await wixClient.collections.queryCollections().find();

  return (
    <div className="px-4 md:px-8 py-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">Shop by Category</h2>
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
          {cats.items.map((item) => (
            <Link
              href={`/list?cat=${item.slug}`}
              className="flex flex-col items-center group flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 transition-all duration-300 hover:scale-105"
              key={item._id}
            >
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-md">
                <Image
                  src={item.media?.mainMedia?.image?.url || "/cat.png"}
                  alt={item.name || "Category image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:opacity-90 transition-opacity"
                  priority={false}
                />
                <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {item.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;