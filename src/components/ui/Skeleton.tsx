function pulse(className: string) {
  return <div className={`skeleton-shimmer rounded-md ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5 shadow-card">
      {pulse("h-3 w-20 mb-3")}
      {pulse("h-8 w-24")}
    </div>
  );
}

export function SkeletonChart({ height = 260 }: { height?: number }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5 shadow-card">
      {pulse("h-4 w-32 mb-4")}
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
