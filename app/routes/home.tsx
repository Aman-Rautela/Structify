import Navbar from "../../components/Navbar";
import type { Route } from "./+types/home";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      <h1 className="text-6xl font-extrabold text-neutral-300">Yo</h1>
    </div>
  )
}
