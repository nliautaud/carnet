
export function updateMeta(text) {
  if (!text) text = {
    title: "Carnet",
    content: "Take a note."
  }
  const title = text.title || "minitms"
  const excerpt = (text.content || "").replace(/<[^>]+>/g, '').slice(0, 140)
  const ogTitle = document.getElementById("og-title")
  const ogDesc = document.getElementById("og-desc")
  const twTitle = document.getElementById("tw-title")
  const twDesc = document.getElementById("tw-desc")
  const ogUrl = document.getElementById("og-url")
  const ogImg = document.getElementById("og-img")
  const twImg = document.getElementById("tw-img")
  if (ogTitle) ogTitle.setAttribute("content", title)
  if (ogDesc) ogDesc.setAttribute("content", excerpt)
  if (twTitle) twTitle.setAttribute("content", title)
  if (twDesc) twDesc.setAttribute("content", excerpt)
  if (ogUrl) ogUrl.setAttribute("content", window.location.href)
  if (ogImg) ogImg.setAttribute("content", "/vite.svg")
  if (twImg) twImg.setAttribute("content", "/vite.svg")
  if (typeof document !== "undefined") {
    document.title = title
  }
}