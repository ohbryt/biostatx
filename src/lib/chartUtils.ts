/* ═══ Chart Style Config ═══ */
export interface ChartStyleConfig {
  bgColor: string;
  gridColor: string;
  axisColor: string;
  fontSize: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  showGrid: boolean;
  strokeWidth: number;
}

export const defaultChartConfig: ChartStyleConfig = {
  bgColor: "#1e1e2e",
  gridColor: "#2a2a3e",
  axisColor: "#94a3b8",
  fontSize: 10,
  primaryColor: "#f97316",
  secondaryColor: "#3b82f6",
  accentColor: "#10b981",
  showGrid: true,
  strokeWidth: 2,
};

/* ═══ Download Utilities ═══ */
export async function downloadChartAsPNG(
  chartRef: HTMLDivElement | null,
  filename: string,
  bgColor: string = "#1e1e2e"
) {
  if (!chartRef) return;
  const svg = chartRef.querySelector("svg");
  if (!svg) return;

  const rect = svg.getBoundingClientRect();
  const width = rect.width || 800;
  const height = rect.height || 400;

  const svgClone = svg.cloneNode(true) as SVGElement;
  svgClone.setAttribute("width", String(width));
  svgClone.setAttribute("height", String(height));

  // Insert background
  const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bgRect.setAttribute("width", "100%");
  bgRect.setAttribute("height", "100%");
  bgRect.setAttribute("fill", bgColor);
  svgClone.insertBefore(bgRect, svgClone.firstChild);

  const svgData = new XMLSerializer().serializeToString(svgClone);
  const img = new Image();
  const canvas = document.createElement("canvas");
  canvas.width = width * 2;
  canvas.height = height * 2;

  return new Promise<void>((resolve) => {
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${filename}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        resolve();
      }, "image/png");
    };
    img.onerror = () => resolve();
    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  });
}

export function downloadChartAsSVG(
  chartRef: HTMLDivElement | null,
  filename: string
) {
  if (!chartRef) return;
  const svg = chartRef.querySelector("svg");
  if (!svg) return;
  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
