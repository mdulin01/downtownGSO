const BUILD_DATE = '2026-02-22';
const BUILD_VERSION = '0.2.0';

export default function BuildFooter() {
  return (
    <footer className="border-t border-white/5 py-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
        <span>downtownGSO.org — Made by Mike Dulin & Adam</span>
        <span>Build {BUILD_VERSION} · {BUILD_DATE}</span>
      </div>
    </footer>
  );
}
