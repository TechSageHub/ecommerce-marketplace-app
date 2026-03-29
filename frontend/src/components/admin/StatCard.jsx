function StatCard({ label, value, hint }) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(145deg,#ffffff_0%,#f5f9ff_46%,#eef4ff_100%)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
      <div className="absolute right-[-1.5rem] top-[-1.5rem] h-20 w-20 rounded-full bg-cyan-200/30 blur-2xl" />
      <p className="relative text-[0.68rem] uppercase tracking-[0.4em] text-slate-400">{label}</p>
      <p className="relative mt-4 text-4xl font-bold tracking-tight text-slate-950">{value}</p>
      <p className="relative mt-3 max-w-[14rem] text-sm leading-6 text-slate-500">{hint}</p>
    </div>
  );
}

export default StatCard;
