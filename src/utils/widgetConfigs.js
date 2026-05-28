export const getDefaultSettings = (type) => {
  const defaultSettings = { 
    scale: 1.0, 
    opacity: 0.4, 
    blur: 24, 
    radius: 32, 
    borderWidth: 1, 
    padding: 24, 
    bgColorHex: '#000000', 
    fontFamily: 'inherit', 
    color: 'white' 
  }
  
  if (type === 'clock') {
    defaultSettings.format = '24h'
    defaultSettings.width = 300
    defaultSettings.height = 160
  } else if (type === 'crypto') {
    defaultSettings.coin = 'solana'
    defaultSettings.width = 240
    defaultSettings.height = 140
  } else if (type === 'weather') {
    defaultSettings.width = 200
    defaultSettings.height = 160
  } else if (type === 'sysmon') {
    defaultSettings.width = 300
    defaultSettings.height = 180
  } else if (type === 'stock') {
    defaultSettings.width = 280
    defaultSettings.height = 200
    defaultSettings.stockSymbol = 'AAPL'
    defaultSettings.basePrice = 175.50
  } else if (type === 'github') {
    defaultSettings.width = 320
    defaultSettings.height = 140
  } else if (type === 'calendar') {
    defaultSettings.width = 240
    defaultSettings.height = 240
  } else if (type === 'news') {
    defaultSettings.width = 300
    defaultSettings.height = 160
  } else if (type === 'shortcuts') {
    defaultSettings.width = 300
    defaultSettings.height = 100
    defaultSettings.isTransparent = true
  } else if (type === 'countdown') {
    defaultSettings.width = 280
    defaultSettings.height = 140
  } else if (type === 'worldclock') {
    defaultSettings.width = 220
    defaultSettings.height = 180
  } else if (type === 'custom') {
    defaultSettings.htmlContent = `<style>\nbody { color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }\nh1 { text-shadow: 0 2px 4px rgba(0,0,0,0.5); }\n</style>\n<h1>Kendi Widget'ım</h1>`
    defaultSettings.width = 300
    defaultSettings.height = 200
  } else if (type === 'smart') {
    defaultSettings.smartType = 'text'
    defaultSettings.textContent = 'Yeni Akıllı Widget'
  }

  return defaultSettings;
}
