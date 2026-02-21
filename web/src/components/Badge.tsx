const variants: Record<string, string> = {
  TGT: "bg-blue-100 text-blue-800",
  PGT: "bg-purple-100 text-purple-800",
  OTHER: "bg-gray-100 text-gray-800",
  source: "bg-amber-100 text-amber-800",
};

export default function Badge({
  text,
  variant = "OTHER",
}: {
  text: string;
  variant?: string;
}) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.OTHER}`}
    >
      {text}
    </span>
  );
}
