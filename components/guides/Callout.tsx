/** Highlighted aside used inside guide articles for a key takeaway or tip. */
export default function Callout({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="mt-8 rounded-2xl border border-[#DCE3F2] bg-[#EEF2FD] p-6 sm:p-7">
      {title && (
        <p className="mb-1.5 text-sm font-bold uppercase tracking-widest text-[#4565E6]">
          {title}
        </p>
      )}
      <div className="text-[17px] leading-[1.6] text-[#2C3656] [&_strong]:font-semibold [&_strong]:text-[#0E1A3C]">
        {children}
      </div>
    </aside>
  );
}
