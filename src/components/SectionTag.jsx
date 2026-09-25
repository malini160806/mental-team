export default function SectionTag({ icon: Icon, children, className = '' }) {
  return (
    <p className={`flex items-center gap-2 text-[11px] font-bold tracking-wide text-indigo-500 ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </p>
  );
}
