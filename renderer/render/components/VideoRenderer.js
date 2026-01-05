export function VideoRenderer(url, fitMode) {
  return `
    <video src="${url}" autoplay muted loop
           style="width:100%;height:100%;object-fit:${fitMode};background:black;">
    </video>
  `;
}
