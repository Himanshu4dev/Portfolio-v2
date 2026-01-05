import AdminDashboard from "@/components/admin-dashboard"

export const metadata = {
  title: "Admin — Testimonials",
}

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <AdminDashboard />
    </main>
  )
}
