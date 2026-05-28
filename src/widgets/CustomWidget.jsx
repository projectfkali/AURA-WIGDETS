export default function CustomWidget({ settings }) {
  const defaultHtml = `<style>
  body { margin: 0; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; }
  h1 { font-size: 24px; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
</style>
<h1>Merhaba Dünya!</h1>
<script>
  console.log('Custom widget loaded!');
</script>`

  const htmlContent = settings.htmlContent || defaultHtml

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 bg-black/50 text-white/50 text-[8px] px-2 py-0.5 rounded-bl-lg z-10 pointer-events-none">
        Özel Widget
      </div>
      <iframe 
        srcDoc={htmlContent} 
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin"
        title="Custom Widget"
      />
    </div>
  )
}
