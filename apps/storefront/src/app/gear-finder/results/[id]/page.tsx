import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { storeApi } from "@/lib/api";
import { FinderResultsView } from "@/components/finder/FinderResultsView";

interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ResultsPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Kết Quả Đề Xuất #${id} | PeakGear Smart Gear-Finder`,
    description: "Bộ trang bị trekking, hiking & camping được tính toán tối ưu theo phương pháp The Big Three.",
  };
}

export default async function GearFinderResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;
  const recommendations = await storeApi.getFinderRecommendationsById(id);

  if (!recommendations) {
    notFound();
  }

  return <FinderResultsView recommendations={recommendations} />;
}
