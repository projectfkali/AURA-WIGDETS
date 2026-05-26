<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=220&section=header&text=AURA%20WIDGETS&fontSize=80&fontAlignY=40&desc=The%20Next-Gen%20Desktop%20Customization%20Engine&descAlignY=60&descSize=18&animation=twinkling" width="100%" alt="Aura Widgets Header" />

Aura Widgets is a **frameless, transparent, and modular** desktop widget engine built with web technologies. Transform your Windows desktop into a dynamic, beautiful, and highly productive workspace.

<br>

> ⚠️ **Bu proje aktif olarak geliştirilme aşamasındadır.** Birçok özellik henüz tamamlanmamış olup, bilinen çok sayıda bug ve eksiklik bulunmaktadır. Kararlı (stable) bir sürüm değildir; kendi sorumluluğunuzda kullanınız.

<br>

[![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)](https://electronjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)](https://www.framer.com/motion/)

<br><br>
</div>

## 🚧 Geliştirme Durumu & Bilinen Sorunlar

> **Bu proje hâlâ erken geliştirme (Early Development) aşamasındadır.**  
> Aşağıdaki listede bilinen başlıca eksiklikler ve hatalar yer almaktadır.

### Bilinen Bug'lar 🐛
- Bazı widget'lar eklendiğinde varsayılan boyutlandırma düzgün çalışmayabilir; boyutu manuel ayarlamak gerekebilir.
- GitHub Heatmap widget'ı şu an simüle edilmiş (mock) veri kullanmaktadır; gerçek GitHub API entegrasyonu henüz tamamlanmamıştır.
- Haber (News) widget'ı şu an sabit (hardcoded) demo haberleri göstermektedir; gerçek RSS/API entegrasyonu yapılmamıştır.
- Sistem Monitörü (SysMon) CPU okumalarında ilk birkaç saniye yanlış değerler gösterebilir.
- Şeffaf mod (Transparent Mode) bazı Windows sürümlerinde beklenen gibi çalışmayabilir.
- Widget sürükle-bırak işlemi nadiren takılabilir veya pozisyon kaydetmeyebilir.
- Masaüstü Dock (Shortcuts) widget'ında kısayol düzenleme değişiklikleri anında yansımayabilir.
- 3D Aura Core widget'ı düşük donanımlı sistemlerde performans sorunlarına yol açabilir.

### Eksik Özellikler 📋
- Gerçek GitHub API entegrasyonu (GraphQL contributions query)
- Gerçek RSS/Haber kaynağı entegrasyonu (NewsAPI, RSS-to-JSON)
- Hava durumu widget'ında serbest şehir arama (şu an sabit 6 şehir)
- Kripto widget'ında daha fazla coin desteği (şu an 4 coin)
- Dünya Saatleri'nde kullanıcının kendi özel şehirlerini ekleyebilmesi
- Geri Sayım widget'ında birden fazla sayaç desteği
- Widget boyut ve pozisyon kilidleme (lock) özelliği
- Çoklu masaüstü profili desteği (ev, iş, oyun)
- Widget animasyon/geçiş efekti özelleştirmesi
- Otomatik güncelleme (auto-update) mekanizması
- Linux ve macOS desteği (şu an yalnızca Windows)

---

## 🌌 The Architecture: Dual-Window System
Aura operates on a unique **Dual-Window Architecture** to provide a seamless experience:
1. **The Widget Layer (Transparent):** A full-screen, click-through, frameless window that sits on your desktop. It renders widgets using `backdrop-filter` for a premium glassmorphism effect.
2. **The Dashboard (Control Center):** A highly polished, Vercel-inspired UI where you manage themes, layouts, and widget settings in real-time. Changes sync instantly via Electron IPC.

---

## ✨ Core Features

<table width="100%">
  <tr>
    <td width="50%">
      <h3>💎 Glassmorphism 2.0</h3>
      <p>True transparent background blur. Customize border radius, opacity, blur intensity, and accent colors for every single widget.</p>
    </td>
    <td width="50%">
      <h3>🧲 Physics-based Drag & Drop</h3>
      <p>Powered by <b>Framer Motion</b>. Widgets stretch naturally when dragged and snap to an invisible 20px magnetic grid when released.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🎵 Native System Media Control</h3>
      <p>Uses a custom PowerShell/C# bridge to trigger <b>Windows Virtual Media Keys</b>. Control Spotify, YouTube, or Apple Music directly from the desktop.</p>
    </td>
    <td width="50%">
      <h3>🌍 Global Themes & Backups</h3>
      <p>Switch between <i>Minimalist</i>, <i>Cyberpunk</i>, and <i>Dark Mode</i> instantly. Export your entire desktop layout as a `.json` file and share it.</p>
    </td>
  </tr>
</table>

---

## 🧩 The Ecosystem

Aura comes pre-loaded with a diverse set of highly optimized widgets:

*   🎛️ **Media Player:** Native OS playback control. Click the album cover to launch your default music app.
*   💻 **SysMon:** CPU & RAM hardware monitoring with radial SVG gauges, uptime, and network status.
*   🔋 **Hardware:** Battery life and Wi-Fi connection tracking using browser navigator APIs.
*   📈 **Crypto Tracker:** Real-time Solana, Bitcoin, Ethereum, and Dogecoin prices with live sparkline charts.
*   📊 **Stock Tracker:** Animated SVG line chart for tracking stock prices.
*   ⏳ **Pomodoro & Clock:** Stay productive with focus timers and sleek 12h/24h clocks.
*   ☁️ **Weather:** Live temperature tracking with multi-city support.
*   📝 **Notes:** Sticky notes that survive reboots.
*   🐙 **GitHub Heatmap:** Contribution graph right on your desktop. *(Currently uses mock data)*
*   📅 **Calendar:** Minimalist monthly calendar widget.
*   📰 **News / RSS:** Auto-scrolling news headlines. *(Currently uses demo data)*
*   🚀 **Shortcuts Dock:** macOS-style quick launcher for your favorite websites.
*   ⏳ **Countdown:** Timer counting down to any custom date/event.
*   🌍 **World Clock:** Multi-timezone clock with day/night indicators.
*   🧠 **Smart Widget (No-Code API):** Fetch and display any JSON endpoint on the web directly on your desktop.
*   ⚙️ **Custom (HTML/JS):** Write raw HTML, CSS, and JS. Aura will render it perfectly within a sandboxed widget frame.
*   🧊 **3D Aura Core:** WebGL-powered 3D decorative widget.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Core App** | `Electron.js` | OS integration, Frameless Windows, IPC bridging. |
| **Framework** | `React 18` + `Vite` | Extremely fast UI rendering and HMR. |
| **Styling** | `Tailwind CSS` | Utility-first styling for the Dashboard and Glassmorphism. |
| **Animation** | `Framer Motion` | Fluid drag-and-drop physics and page transitions. |
| **System API** | `Node child_process` | PowerShell execution for native OS media key simulation. |

---

## 🚀 Getting Started

To run Aura Widgets locally, you need **Node.js (v18+)** installed.

### 1. Clone & Install
```bash
git clone https://github.com/projectfkali/AURA-WIGDETS.git
cd AURA-WIGDETS
npm install
```

### 2. Run the App
```bash
npm start
```
*This command uses Vite to bundle the React frontend, then launches the Electron main process.*

### 3. Usage
*   **Move Widgets:** Click and drag any widget. It will snap to the grid.
*   **Open Settings:** Right-click the ⚡ icon in your System Tray (Taskbar) and click "Ayarlar" (Settings).
*   **Close App:** Right-click the tray icon and select "Çıkış" (Quit).

---

## 🤝 Katkıda Bulunma

Bu proje aktif geliştirme aşamasındadır ve katkılara açıktır. Hata bildirimi, özellik önerisi veya pull request göndermekten çekinmeyin.

---

<div align="center">
  <p>Engineered with precision for Windows by <b>Mert Ali Şahin</b>.</p>
  <p><sub>⚠️ Early Development — Not production-ready.</sub></p>
</div>
