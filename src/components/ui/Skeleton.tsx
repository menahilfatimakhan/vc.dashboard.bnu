function pulse(className: string) {
  return <div className={`animate-pulse rounded-md bg-black/[0.06] ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
      {pulse("h-3 w-20 mb-3")}
      {pulse("h-7 w-24")}
    </div>
  );
}

export function SkeletonChart({ height = 260 }: { height?: number }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
      {pulse("h-4 w-32 mb-4")}
      {pulse(`w-full`)}
      <div style={{ height }} className="mt-2">
        {pulse("h-full w-full")}
      </div>
    </div>
  );
}

export function SkeletonRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          {pulse("h-3.5 w-full")}
        </td>
      ))}
    </tr>
  );
}
