import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Home, Droplets, Sprout, CalendarDays, History, MapPin, Globe, Check, ChevronDown
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';

const NAV = [
  { to: '/',        key: 'nav_home',    icon: Home,       end: true },
  { to: '/soil',    key: 'nav_soil',    icon: Droplets },
  { to: '/crops',   key: 'nav_crops',   icon: Sprout },
  { to: '/plan',    key: 'nav_plan',    icon: CalendarDays },
  { to: '/records', key: 'nav_records', icon: History }
];

const TITLES: Record<string, { title: string; crumb: string }> = {
  '/':        { title: 'header_home_greeting',    crumb: 'header_home_crumb' },
  '/soil':    { title: 'header_soil_title',       crumb: 'header_soil_crumb' },
  '/crops':   { title: 'header_crops_title',      crumb: 'header_crops_crumb' },
  '/plan':    { title: 'header_plan_title',       crumb: 'header_plan_crumb' },
  '/records': { title: 'header_records_title',    crumb: 'header_records_crumb' }
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const { t, lang, setLang, languages } = useI18n();
  const meta = TITLES[pathname] ?? TITLES['/'];

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!langOpen) return;
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [langOpen]);

  const currentLang = languages.find(l => l.code === lang) ?? languages[0];

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand">
          <div className="brand-logo" aria-hidden>
            <Sprout size={22} color="var(--color-soil-950)" />
          </div>
          <div>
            <div className="brand-title">{t('brand_name')}</div>
            <div className="brand-tagline">{t('tagline')}</div>
          </div>
        </div>

        <nav className="nav" aria-label="Main navigation">
          {NAV.map(({ to, key, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <Icon className="icon" size={22} />
              <span>{t(key)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <h4>{t('plan_title')}</h4>
          <p>{t('plan_body')}</p>
          <span className="plan-badge">{t('plan_pill')}</span>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-header">
          <div className="header-title">
            <h1>{t(meta.title)}</h1>
            <div className="crumb">{t(meta.crumb)}</div>
          </div>
          <div className="header-actions">
            <span className="location-pill" style={{ minHeight: 40 }}>
              <MapPin size={16} /> {t('location_pill')}
            </span>
            <div className="lang-dropdown-wrapper" ref={langRef}>
              <button
                type="button"
                className="lang-dropdown-trigger"
                onClick={() => setLangOpen(prev => !prev)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label={t('lang_select')}
              >
                <Globe size={16} />
                <span className="lang-current-label">{currentLang.label}</span>
                <ChevronDown size={14} className={`chev${langOpen ? ' open' : ''}`} />
              </button>
              {langOpen && (
                <div className="lang-menu" role="listbox" aria-label={t('lang_select')}>
                  {languages.map(l => {
                    const active = l.code === lang;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        role="option"
                        aria-selected={active}
                        className={`lang-menu-item${active ? ' active' : ''}`}
                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                      >
                        <span className="lang-code">{l.code.toUpperCase()}</span>
                        <span className="lang-label">{l.label}</span>
                        {active && <Check size={16} className="lang-check" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="avatar" title="Karabo">K</div>
          </div>
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
