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
  const width = settings.width || 300
  const height = settings.height || 200

  return (
    <div className="glass-panel p-2 flex items-center justify-center" style={{ width, height }}>
      <iframe
        srcDoc={htmlContent}
        style={{ width: '100%', height: '100%', border: 'none', background: 'transparent' }}
        sandbox="allow-scripts"
      />
    </div>
  )
}
