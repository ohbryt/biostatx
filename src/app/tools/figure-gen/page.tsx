"use client";

import { useState, useRef } from "react";
import StatToolLayout from "@/components/StatToolLayout";

const STYLES = [
  { value: "scientific", label: "Scientific Illustration", icon: "🔬", desc: "Clean, publication-ready figures" },
  { value: "diagram", label: "Technical Diagram", icon: "📐", desc: "Flowcharts, pathways, schematics" },
  { value: "microscopy", label: "Cell & Microscopy", icon: "🧫", desc: "Cellular structures, organelles" },
  { value: "molecular", label: "Molecular Biology", icon: "🧬", desc: "Proteins, DNA/RNA, pathways" },
  { value: "clinical", label: "Clinical / Anatomy", icon: "🩺", desc: "Anatomical, medical figures" },
  { value: "graphical-abstract", label: "Graphical Abstract", icon: "🎨", desc: "Journal cover / visual summary" },
];

const SIZES = [
  { value: "square", label: "Square (1:1)", desc: "1024×1024" },
  { value: "landscape", label: "Landscape (16:9)", desc: "1792×1024" },
  { value: "portrait", label: "Portrait (9:16)", desc: "1024×1792" },
];

const EXAMPLE_PROMPTS = [
  { label: "Cell Signaling Pathway", prompt: "A detailed scientific illustration of the MAPK/ERK signaling pathway showing receptor tyrosine kinase activation, RAS-RAF-MEK-ERK cascade, with labeled proteins and phosphorylation events. Clean white background, professional arrows and annotations." },
  { label: "CRISPR Mechanism", prompt: "Scientific figure showing CRISPR-Cas9 gene editing mechanism: guide RNA binding to target DNA, Cas9 protein cutting double-stranded DNA, and repair pathways (NHEJ and HDR). Labeled components with clean scientific style." },
  { label: "Drug Delivery Nanoparticle", prompt: "Cross-section diagram of a lipid nanoparticle for mRNA drug delivery, showing lipid bilayer, PEG coating, mRNA cargo inside, and targeting ligands on surface. Clean scientific illustration with labels." },
  { label: "Immunotherapy Mechanism", prompt: "Scientific illustration of CAR-T cell therapy mechanism: T-cell engineering with chimeric antigen receptor, tumor cell recognition, and immune synapse formation. Professional biomedical illustration style." },
  { label: "Graphical Abstract", prompt: "Graphical abstract for a cancer research paper: showing tumor microenvironment with immune cells (T cells, macrophages, dendritic cells), blood vessels, and therapeutic intervention. Modern clean scientific illustration suitable for journal cover." },
  { label: "Western Blot Diagram", prompt: "Technical diagram illustrating the complete Western blot workflow: sample preparation, gel electrophoresis (SDS-PAGE), protein transfer to membrane, antibody incubation, and chemiluminescent detection. Step-by-step with labeled equipment." },
];

export default function FigureGenPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("scientific");
  const [size, setSize] = useState("landscape");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    imageUrl: string;
    revisedPrompt: string;
    model: string;
    size: string;
  } | null>(null);
  const [history, setHistory] = useState<Array<{
    imageUrl: string;
    prompt: string;
    style: string;
    timestamp: number;
  }>>([]);
  const imgRef = useRef<HTMLImageElement>(null);

  const generate = async () => {
    if (!prompt.trim() || prompt.trim().length < 5) {
      setError("Please describe your figure in at least 5 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate-figure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), style, size }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }

      setResult(data);
      setHistory((prev) => [
        { imageUrl: data.imageUrl, prompt: prompt.trim(), style, timestamp: Date.now() },
        ...prev.slice(0, 9),
      ]);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!result?.imageUrl) return;
    try {
      const res = await fetch(result.imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `biostatx-figure-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(result.imageUrl, "_blank");
    }
  };

  return (
    <StatToolLayout
      title="AI Scientific Figure Generator"
      description="Generate publication-ready scientific illustrations from text descriptions. Powered by DALL-E 3. Inspired by FigureLabs."
    >
      {/* Style Selector */}
      <div className="glass-card p-4 mb-4">
        <h3 className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-3">Figure Style</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStyle(s.value)}
              className={`p-3 rounded-xl text-left transition border ${
                style === s.value
                  ? "border-orange-400 bg-orange-50 shadow-sm"
                  : "border-stone-200 hover:border-orange-300 bg-white"
              }`}
            >
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-xs font-semibold text-stone-800 leading-tight">{s.label}</div>
              <div className="text-[10px] text-stone-400 mt-0.5">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt + Controls */}
      <div className="glass-card p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="text-xs font-semibold text-stone-600 block mb-2">Describe Your Figure</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A detailed scientific illustration of the MAPK signaling pathway with labeled proteins, phosphorylation events, and clean arrows on white background..."
              className="w-full h-32 px-3 py-2.5 text-sm rounded-xl border border-stone-200 bg-white text-stone-700 placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none resize-none transition"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-stone-400">{prompt.length} chars · Be specific for best results</span>
              <div className="flex gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSize(s.value)}
                    className={`text-[10px] px-2.5 py-1 rounded-lg font-medium transition border ${
                      size === s.value
                        ? "border-orange-400 bg-orange-50 text-orange-700"
                        : "border-stone-200 text-stone-500 hover:border-orange-300"
                    }`}
                    title={s.desc}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-2 lg:w-48">
            <button
              onClick={generate}
              disabled={loading || !prompt.trim()}
              className={`px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition ${
                loading
                  ? "bg-stone-300 text-stone-500 cursor-wait"
                  : "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-orange-500/25"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                "🎨 Generate Figure"
              )}
            </button>
            {result && (
              <button
                onClick={downloadImage}
                className="px-6 py-2.5 rounded-xl text-sm font-medium border border-orange-300 text-orange-600 hover:bg-orange-50 transition"
              >
                📥 Download PNG
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="mb-4">
        <p className="text-xs text-stone-500 font-medium mb-2">💡 Try an example:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((ex) => (
            <button
              key={ex.label}
              onClick={() => { setPrompt(ex.prompt); setResult(null); setError(null); }}
              className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 text-stone-500 hover:border-orange-300 hover:text-orange-600 transition"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass-card p-4 mb-4 border-l-4 border-red-400 bg-red-50">
          <p className="text-sm text-red-600">❌ {error}</p>
          {error.includes("API key") && (
            <p className="text-xs text-red-500 mt-1">
              Admin: Set <code className="bg-red-100 px-1 rounded">OPENAI_API_KEY</code> in Vercel environment variables.
            </p>
          )}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="glass-card p-6 mb-4">
          <div className="animate-pulse">
            <div className="bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 rounded-xl aspect-video w-full mb-4 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🧬</div>
                <p className="text-sm text-stone-400 font-medium">Generating your scientific figure...</p>
                <p className="text-xs text-stone-400 mt-1">This takes 15-30 seconds</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="glass-card p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-stone-800">🖼️ Generated Figure</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                {result.model} · {result.size}
              </span>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={result.imageUrl}
              alt="Generated scientific figure"
              className="w-full h-auto"
            />
          </div>

          {result.revisedPrompt && (
            <details className="mt-3">
              <summary className="text-xs text-stone-500 cursor-pointer hover:text-orange-600 transition">
                View enhanced prompt (DALL-E 3 revision)
              </summary>
              <p className="mt-2 text-xs text-stone-600 bg-stone-50 rounded-lg p-3 leading-relaxed">
                {result.revisedPrompt}
              </p>
            </details>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="glass-card p-4 mb-4">
          <h3 className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-3">
            Recent Generations ({history.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setResult({ imageUrl: item.imageUrl, revisedPrompt: "", model: "dall-e-3", size: "" });
                  setPrompt(item.prompt);
                  setStyle(item.style);
                }}
                className="group relative rounded-lg overflow-hidden border border-stone-200 hover:border-orange-300 transition aspect-square"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                  <p className="absolute bottom-1.5 left-2 right-2 text-[9px] text-white leading-tight line-clamp-2">
                    {item.prompt.slice(0, 60)}...
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inspiration Gallery */}
      <div className="glass-card p-5 mb-4">
        <h3 className="text-sm font-semibold text-stone-800 mb-1">🎨 Inspiration — What You Can Create</h3>
        <p className="text-xs text-stone-500 mb-4">Click any example to use as your starting prompt.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Cell Signaling Cascade", category: "Molecular Biology", color: "bg-blue-50 border-blue-200", icon: "🧫",
              desc: "MAPK/ERK, PI3K/AKT, Wnt/β-catenin pathways with labeled phosphorylation events" },
            { title: "Drug Mechanism of Action", category: "Pharmacology", color: "bg-emerald-50 border-emerald-200", icon: "💊",
              desc: "Receptor binding, intracellular signaling, downstream effects diagram" },
            { title: "Experimental Workflow", category: "Methods", color: "bg-amber-50 border-amber-200", icon: "🔬",
              desc: "Step-by-step protocol diagrams: sample collection → processing → analysis" },
            { title: "Tissue Cross-Section", category: "Histology", color: "bg-purple-50 border-purple-200", icon: "🩺",
              desc: "Layered tissue architecture with cell type labels and annotations" },
            { title: "Gene Editing Schematic", category: "Genetics", color: "bg-red-50 border-red-200", icon: "✂️",
              desc: "CRISPR-Cas9, base editing, prime editing mechanism illustrations" },
            { title: "Graphical Abstract", category: "Publication", color: "bg-orange-50 border-orange-200", icon: "📄",
              desc: "Visual summary combining key findings for journal submission" },
          ].map((item) => (
            <button
              key={item.title}
              onClick={() => { setPrompt(`Scientific illustration: ${item.title}. ${item.desc}. Clean publication-ready style with labels and annotations on white background.`); setError(null); setResult(null); }}
              className={`${item.color} border rounded-xl p-4 text-left hover:shadow-md transition group`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider font-medium">{item.category}</div>
                  <div className="text-sm font-semibold text-stone-800 group-hover:text-orange-700 transition">{item.title}</div>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="glass-card p-4">
        <h3 className="text-xs font-semibold text-stone-700 mb-2">📖 About AI Figure Generation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600">
          <div className="bg-stone-50 rounded-lg p-3">
            <h4 className="font-bold text-stone-700 mb-1">Powered by DALL-E 3</h4>
            <p className="leading-relaxed">OpenAI&apos;s most advanced image model with HD quality output up to 1792×1024px.</p>
          </div>
          <div className="bg-stone-50 rounded-lg p-3">
            <h4 className="font-bold text-stone-700 mb-1">Publication Ready</h4>
            <p className="leading-relaxed">Optimized prompts for clean scientific style suitable for papers, posters, and presentations.</p>
          </div>
          <div className="bg-stone-50 rounded-lg p-3">
            <h4 className="font-bold text-stone-700 mb-1">Tips for Best Results</h4>
            <p className="leading-relaxed">Be specific: mention cell types, proteins, labels, background color, and layout preferences.</p>
          </div>
        </div>
      </div>
    </StatToolLayout>
  );
}
