const BUILD_DATE = '2026-03-07';
const BUILD_VERSION = '0.3.0';

export default function BuildFooter() {
  return (
    <footer className="border-t border-white/5 py-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
        <span>
          downtownGSO.org — Made by{' '}
          <a href="https://mikedulinmd.app" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-emerald-400 transition">
            Mike Dulin, MD
          </a>
          {' · Built with '}
          <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-emerald-400 transition">
            Claude
          </a>
        </span>
        <span>Build {BUILD_VERSION} · {BUILD_DATE}</span>
      </div>
    </footer>
  );
}
