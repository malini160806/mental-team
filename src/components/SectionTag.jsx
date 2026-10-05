export default function SectionTag({ icon: Icon, children, className = '' }) {
  return (
    <p className={`flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] ${className}`}>
      {Icon ? <Icon size={12} className="text-violet-500" /> : <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />}
      <span className="text-gradient">{children}</span>
    </p>
  );
}
