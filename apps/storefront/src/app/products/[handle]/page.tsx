import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { storeApi } from "@/lib/api";
import { ProductDetailView } from "@/components/product/ProductDetailView";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await storeApi.getProductByHandle(handle);

  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm | PeakGear",
    };
  }

  const productTitle = product.title || product.name || "Sản phẩm";
  return {
    title: `${productTitle} - ${product.brand} | PeakGear`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await storeApi.getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  // Fetch bundles related to this product or activity
  const bundles = await storeApi.getBundles(product.activity);
  const relatedBundles = bundles.filter(
    (b) =>
      b.components.some((c) => c.productId === product.id) ||
      b.activity.toLowerCase() === product.activity?.toLowerCase()
  );

  return (
    <ProductDetailView product={product} relatedBundles={relatedBundles} />
  );
}
