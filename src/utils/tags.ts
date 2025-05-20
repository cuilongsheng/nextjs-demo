export const availableTags = [
  "技术",
  "生活",
  "随笔",
  "教程",
  "分享",
  "问答",
  "其他",
] as const;

export type Tag = (typeof availableTags)[number];

export const tagColors = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-yellow-100 text-yellow-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
  "bg-indigo-100 text-indigo-800",
] as const;

export const getTagColor = (index: number) =>
  tagColors[index % tagColors.length];
