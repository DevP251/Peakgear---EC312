import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { storeApi } from "@/lib/api";
import { BundleDetailView } from "@/components/bundle/BundleDetailView";

interface BundlePageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: BundlePageProps): Promise<Metadata> {
  const { handle } = await params;
  const bundle = await storeApi.getBundleByHandle(handle);

  if (!bundle) {
    return {
      title: "Không tìm thấy gói trang bị | PeakGear",
    };
  }

  const discount = bundle.discountPercent ?? bundle.discountPercentage;

  return {
    title: `${bundle.title} - Gói Tiết Kiệm ${discount}% | PeakGear`,
    description: bundle.description,
  };
}

export default async function BundleDetailPage({ params }: BundlePageProps) {
  const { handle } = await params;
  const bundle = await storeApi.getBundleByHandle(handle);

  if (!bundle) {
    notFound();
  }

  return <BundleDetailView bundle={bundle} />;
}
