import Image from "next/image";
import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import { wixClientServer } from "@/lib/wixClientServer";
import { Suspense } from "react";

const ListPage = async ({ searchParams }: { searchParams: any }) => {
  const wixClient = await wixClientServer();

  const cat = await wixClient.collections.getCollectionBySlug(
    searchParams.cat || "all-products"
  );

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* CAMPAIGN */}
      <div className="hidden bg-cyan-100 px-4 sm:flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
                   Solar energy—clean, abundant,
            <br /> and ready for you
          </h1>
        </div>
        <div className="relative w-1/3">
          <Image src="/Solar.png" alt="" fill className="object-contain" />
        </div>
      </div>
      {/* FILTER */}
      {/* <Filter /> */}
      {/* PRODUCTS */}
      <h1 className="mt-12 text-xl font-semibold">For You!</h1>
      <Suspense fallback={"loading..."}>
        <ProductList
          categoryId={
            cat.collection?._id || "00000000-000000-000000-000000000001"
          }
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
};

export default ListPage;
