export function ImageRenderer(url, fitMode) {
  return `
    <img src="${url}" style="width:100%;height:100%;object-fit:${fitMode};background:black;">
  `;
}
