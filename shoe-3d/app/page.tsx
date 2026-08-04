import { ShoeViewer } from "../src/components/ShoeViewer";

export default function Home() {
  return (
    <main className="w-full bg-zinc-950 text-white">
      {/* Fixed Background Layer for 3D Viewer */}
      <div className="fixed inset-0 z-0">
        <ShoeViewer />
      </div>

      {/* Scrollable Foreground Sections */}
      <div className="relative z-10 pointer-events-none">
        {/* Section 1: Default (White) */}
        <section
          data-color="#ffffff"
          className="color-section h-screen w-full flex items-center justify-center"
        >
        </section>
        
        {/* Section 2: Red */}
        <section
          data-color="#ef4444"
          className="color-section h-screen w-full flex items-center justify-center bg-red-500/10"
        >
          <div className="p-8 bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-red-500/30">
            <h2 className="text-4xl font-black text-red-500 uppercase tracking-widest">Red Section</h2>
          </div>
        </section>

        {/* Section 3: Green */}
        <section
          data-color="#22c55e"
          className="color-section h-screen w-full flex items-center justify-center bg-green-500/10"
        >
          <div className="p-8 bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-green-500/30">
            <h2 className="text-4xl font-black text-green-500 uppercase tracking-widest">Green Section</h2>
          </div>
        </section>
        
        {/* Section 4: Blue */}
        <section
          data-color="#3b82f6"
          className="color-section h-screen w-full flex items-center justify-center bg-blue-500/10"
        >
          <div className="p-8 bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-blue-500/30">
            <h2 className="text-4xl font-black text-blue-500 uppercase tracking-widest">Blue Section</h2>
          </div>
        </section>
      </div>
    </main>
  );
}