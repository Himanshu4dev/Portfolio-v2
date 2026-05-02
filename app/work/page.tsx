import Header from "@/components/header"
import WorkGallery from "@/components/work-gallery"

export const metadata = {
  title: "Work — Portfolio",
}

export default function Page() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen bg-background/95 pt-28 pb-16 px-4 sm:px-6 overflow-x-hidden">
        <WorkGallery />
      </main>
    </>
  )
}
