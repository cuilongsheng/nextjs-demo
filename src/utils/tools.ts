// 格式化时间戳
export function formatTimestamp(timestamp: string | undefined) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString();
}