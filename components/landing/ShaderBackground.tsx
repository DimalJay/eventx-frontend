export default function ShaderBackground() {
  return (
    <div
      aria-hidden="true"
      className="taste-shader pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="taste-shader-blob taste-shader-blob-a" />
      <div className="taste-shader-blob taste-shader-blob-b" />
      <div className="taste-shader-blob taste-shader-blob-c" />
      <div className="taste-shader-grain" />
    </div>
  );
}