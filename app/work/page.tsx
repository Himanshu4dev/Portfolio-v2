import WorkGallery from "@/components/work-gallery"

export const metadata = {
  title: "Work — Portfolio",
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background/95 pt-28 pb-16 px-4 sm:px-6">
      <WorkGallery />
    </main>
  )
}
