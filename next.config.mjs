/**
 * Allow loading the dev server from another device on your LAN (phone/tablet).
 * Next.js blocks cross-origin requests to dev internals unless the browser origin host is allowed.
 * Set NEXT_DEV_ALLOWED_ORIGINS in .env.local to your PC's LAN IP or hostname (comma-separated).
 * Example: NEXT_DEV_ALLOWED_ORIGINS=192.168.1.42
 */
const allowedDevOrigins = process.env.NEXT_DEV_ALLOWED_ORIGINS
  ? process.env.NEXT_DEV_ALLOWED_ORIGINS.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : []

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  ...(allowedDevOrigins.length > 0 ? { allowedDevOrigins } : {}),
}

export default nextConfig
