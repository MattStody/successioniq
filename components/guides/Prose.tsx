/**
 * Long-form typography for guide articles. Hand-rolled with Tailwind v4 child
 * selectors (no @tailwindcss/typography dependency) so the reading experience
 * matches the FairMark landing palette exactly. Author article bodies as plain
 * semantic JSX (<h2>, <p>, <ul>, <blockquote>, …) and wrap them in <Prose>.
 */
export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        text-[18px] leading-[1.75] text-[#2C3656]
        [&>*:first-child]:mt-0
        [&_p]:mt-5
        [&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:text-[28px] [&_h2]:font-extrabold [&_h2]:leading-[1.15] [&_h2]:tracking-[-0.02em] [&_h2]:text-[#0E1330] sm:[&_h2]:text-[32px]
        [&_h3]:mt-10 [&_h3]:mb-2.5 [&_h3]:text-[21px] [&_h3]:font-bold [&_h3]:tracking-[-0.01em] [&_h3]:text-[#0E1330]
        [&_strong]:font-semibold [&_strong]:text-[#0E1330]
        [&_a]:font-semibold [&_a]:text-[#3f57e6] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-[#4F6BFF]
        [&_ul]:mt-5 [&_ul]:space-y-2.5
        [&_ul>li]:relative [&_ul>li]:pl-7
        [&_ul>li]:before:absolute [&_ul>li]:before:left-1 [&_ul>li]:before:top-[0.68em] [&_ul>li]:before:h-1.5 [&_ul>li]:before:w-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-[#4F6BFF] [&_ul>li]:before:content-['']
        [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2.5 [&_ol]:pl-6 [&_ol>li]:pl-1.5 [&_ol>li]:marker:font-semibold [&_ol>li]:marker:text-[#4F6BFF]
        [&_blockquote]:mt-8 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#4F6BFF] [&_blockquote]:pl-5 [&_blockquote]:text-[20px] [&_blockquote]:font-medium [&_blockquote]:leading-[1.5] [&_blockquote]:text-[#0E1330]
        [&_hr]:my-12 [&_hr]:border-[#E3E8F3]
      "
    >
      {children}
    </div>
  );
}
