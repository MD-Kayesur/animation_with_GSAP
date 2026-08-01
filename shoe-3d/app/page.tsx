// import { ShoeViewer } from "@/public/ShoeViewer";
import { ShoeViewer } from "../src/components/ShoeViewer";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">3D Sneaker Configurator</h1>
        <p className="text-zinc-400 mb-8">
          Rotate • Zoom • Change colors • Camera presets • Screenshot
        </p>
        
        {/* <ShoeViewer /> */}
        <ShoeViewer />
      </div>
    </main>
  );
}