import { Suspense } from "react";
import Dashboard from "@/components/dashboard";
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
 const { slug = [] } = await params;
 return <Suspense fallback={<div className="app-loading" role="status">TRACKFLOW · 載入中…</div>}><Dashboard route={slug.join("/") || "overview"} /></Suspense>;
}
