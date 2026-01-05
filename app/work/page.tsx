import WorkGallery from "@/components/work-gallery"

export const metadata = {
  title: "Work — Portfolio",
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background py-12">
      <WorkGallery />
    </main>
  )
}
