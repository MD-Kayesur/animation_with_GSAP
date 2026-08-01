// import { ShoeViewer } from "@/public/ShoeViewer";
import { ShoeViewer } from "../src/components/ShoeViewer";

export default function Home() {
  return (
    <main className="h-screen w-full bg-zinc-950 text-white overflow-hidden">
      <ShoeViewer />
    </main>
  );
}