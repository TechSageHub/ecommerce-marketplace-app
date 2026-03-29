import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(180deg,#fffaf4_0%,#f5ecdf_100%)] px-4">
      <div className="max-w-lg rounded-[34px] border border-white/70 bg-white/80 p-10 text-center shadow-[0_24px_60px_rgba(62,41,17,0.1)] backdrop-blur">
        <p className="text-sm uppercase tracking-[0.35em] text-[#8b6e4a]">404</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-950">
          Page not found
        </h1>
        <p className="mt-4 leading-7 text-slate-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-[#f68b1e] px-5 py-3 text-white shadow-[0_16px_30px_rgba(246,139,30,0.24)]"
        >
          Go to storefront
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
