import { Wind } from 'lucide-react';

export default function Breathe() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-indigo-50 text-indigo-600">
        <Wind size={26} />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
        Breathing space, coming soon.
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">
        A guided box-breathing exercise will live here. For now, head back to the Sanctuary or
        continue your reflection.
      </p>
    </div>
  );
}
