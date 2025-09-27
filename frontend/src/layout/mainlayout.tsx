import { Outlet, Link } from "react-router-dom"
import dexon from "../assets/Dexon-Main-logo.png"

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col border">
      <div className="bg-white border border-red  text-white h-20 flex items-center justify-center">
        <img src={dexon} alt="" className="w-40 " />
      </div>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}
