import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Bus,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  Download,
  FileCheck2,
  Gauge,
  HeartHandshake,
  IndianRupee,
  Info,
  Layers3,
  LifeBuoy,
  LockKeyhole,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  MoreHorizontal,
  Navigation,
  PanelLeft,
  Phone,
  QrCode,
  Radio,
  ScanLine,
  ShieldCheck,
  Siren,
  Sparkles,
  Sun,
  UserCheck,
  Users,
  WalletCards,
  X,
} from "lucide-react";

type Role = "parent" | "driver" | "school" | "control";
type ParentTab = "home" | "track" | "alerts" | "billing";

type TimelineEvent = {
  time: string;
  title: string;
  detail: string;
  state: "done" | "current" | "pending";
  icon: "home" | "crew" | "school" | "collector";
};

const roleMeta: Record<Role, { label: string; sublabel: string }> = {
  parent: { label: "Parent view", sublabel: "Aarav's household" },
  driver: { label: "Crew view", sublabel: "Ramesh · Van 04" },
  school: { label: "School console", sublabel: "The Shri Ram School" },
  control: { label: "Control room", sublabel: "Gurugram pocket" },
};

const baseTimeline: TimelineEvent[] = [
  { time: "07:31", title: "Aarav checked in", detail: "Home handoff verified by Meera", state: "done", icon: "home" },
  { time: "07:34", title: "Sarathi Van 04 departed", detail: "Route corridor locked · 9 children aboard", state: "current", icon: "crew" },
  { time: "07:52", title: "School gate handoff", detail: "Waiting for school countersignature", state: "pending", icon: "school" },
  { time: "15:48", title: "Home handoff", detail: "Collector: Meera Sharma", state: "pending", icon: "collector" },
];

const quickTrips = [
  { date: "Today", route: "Home → The Shri Ram School", status: "In progress", tone: "blue", meta: "9 of 9 checked in" },
  { date: "Yesterday", route: "School → Home", status: "Verified safe", tone: "green", meta: "All 4 handoffs complete" },
  { date: "Mon, 14 Sep", route: "Home → The Shri Ram School", status: "Verified safe", tone: "green", meta: "Arrived 07:54" },
];

function IconBadge({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "green" | "amber" | "red" | "slate" }) {
  return <div className={`icon-badge icon-badge-${tone}`}>{children}</div>;
}

function StatusPill({ children, tone = "blue" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`status-pill status-${tone}`}>{children}</span>;
}

function Sparkline({ tone = "blue" }: { tone?: "blue" | "green" | "amber" }) {
  const points = tone === "green" ? "0,32 16,29 32,30 48,21 64,23 80,14 96,16 112,5" : tone === "amber" ? "0,24 16,26 32,21 48,24 64,12 80,17 96,6 112,10" : "0,27 16,19 32,23 48,14 64,16 80,9 96,12 112,3";
  return (
    <svg className="sparkline" viewBox="0 0 112 36" aria-hidden="true">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`${points} 112,36 0,36`} fill="currentColor" opacity=".08" stroke="none" />
    </svg>
  );
}

function RouteIllustration({ live = true }: { live?: boolean }) {
  return (
    <div className="route-map" aria-label="Illustrated route from home to school">
      <div className="map-grid" />
      <div className="map-road road-one" />
      <div className="map-road road-two" />
      <div className="map-road road-three" />
      <div className="route-line" />
      <div className="map-label home-label"><span className="map-dot dot-home" /><span>Sector 43</span></div>
      <div className="map-label school-label"><span className="map-dot dot-school" /><span>TSRS gate 2</span></div>
      <div className="route-stop stop-one"><span>1</span></div>
      <div className="route-stop stop-two"><span>2</span></div>
      {live && <div className="vehicle-marker"><Bus size={17} /><span>Van 04</span></div>}
      <div className="map-legend"><span><i className="legend-line" /> fixed corridor</span><span><i className="legend-dot" /> live crew</span></div>
    </div>
  );
}

function Timeline({ events, onVerify }: { events: TimelineEvent[]; onVerify: () => void }) {
  return (
    <div className="timeline-list">
      {events.map((event, index) => (
        <div className={`timeline-row timeline-${event.state}`} key={`${event.title}-${index}`}>
          <div className="timeline-rail">
            <div className="timeline-node">
              {event.state === "done" ? <Check size={14} strokeWidth={3} /> : event.state === "current" ? <Radio size={14} /> : <span />}
            </div>
            {index < events.length - 1 && <div className="timeline-line" />}
          </div>
          <div className="timeline-copy">
            <div className="timeline-topline"><span className="timeline-time">{event.time}</span><span className="timeline-title">{event.title}</span></div>
            <p>{event.detail}</p>
            {event.state === "current" && <div className="live-note"><span className="live-pulse" /> Live · corridor normal</div>}
            {event.state === "pending" && index === 2 && <button className="text-action" onClick={onVerify}><ScanLine size={14} /> Preview gate scan</button>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Shell({ role, setRole, children, dark, setDark }: { role: Role; setRole: (role: Role) => void; children: ReactNode; dark: boolean; setDark: (value: boolean) => void }) {
  const [mobileNav, setMobileNav] = useState(false);
  const roles: Role[] = ["parent", "driver", "school", "control"];
  return (
    <div className={`app-shell ${dark ? "app-dark" : ""}`}>
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand-lockup"><div className="brand-mark"><HeartHandshake size={19} strokeWidth={2.4} /></div><div><div className="brand-name">sarathi</div><div className="brand-tag">care in motion</div></div></div>
        <div className="workspace-label">WORKSPACE</div>
        <div className="role-switcher">
          {roles.map((item) => <button className={`role-item ${role === item ? "role-selected" : ""}`} key={item} onClick={() => { setRole(item); setMobileNav(false); }}><span className={`role-avatar role-${item}`}>{item === "parent" ? "AS" : item === "driver" ? "RM" : item === "school" ? "TS" : "CR"}</span><span><strong>{roleMeta[item].label}</strong><small>{roleMeta[item].sublabel}</small></span>{role === item && <ChevronRight size={15} className="role-chevron" />}</button>)}
        </div>
        <div className="sidebar-rule" />
        <div className="nav-group-label">SAFETY LAYER</div>
        <button className="sidebar-link active-link"><ShieldCheck size={17} /><span>Live safety view</span><span className="nav-live" /></button>
        <button className="sidebar-link" onClick={() => window.alert("Custody ledger is available in the full pilot workspace.")}><FileCheck2 size={17} /><span>Custody ledger</span><span className="nav-count">24</span></button>
        <button className="sidebar-link" onClick={() => window.alert("Route planner preview — fixed corridors only in v1.")}><Navigation size={17} /><span>Routes & pods</span></button>
        <div className="nav-group-label nav-group-spaced">OPERATIONS</div>
        <button className="sidebar-link" onClick={() => window.alert("No unresolved incidents. Escalation desk is staffed.")}><AlertTriangle size={17} /><span>Exceptions</span><span className="nav-count count-warn">1</span></button>
        <button className="sidebar-link" onClick={() => window.alert("Crew checks are up to date for Van 04.")}><UserCheck size={17} /><span>Crew checks</span></button>
        <button className="sidebar-link" onClick={() => window.alert("Pilot KPI dictionary loaded: verified handoffs, on-time, empty-cabin closure.")}><Gauge size={17} /><span>Pilot metrics</span></button>
        <div className="sidebar-bottom"><div className="privacy-card"><div className="privacy-icon"><LockKeyhole size={15} /></div><div><strong>Privacy-aware by design</strong><p>Event-log assist only. No cabin media leaves the vehicle.</p></div></div><div className="sidebar-user"><div className="mini-avatar">AS</div><div><strong>Ananya Sharma</strong><small>Household admin</small></div><MoreHorizontal size={17} className="muted-icon" /></div></div>
      </aside>
      {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <main className="main-shell">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={20} /></button><div className="breadcrumb"><span>Gurugram pilot</span><ChevronRight size={14} /><strong>{roleMeta[role].label}</strong></div><div className="topbar-actions"><div className="system-status"><span className="status-dot" /> All systems normal</div><button className="topbar-icon" aria-label="Notifications"><Bell size={18} /><span className="notification-dot" /></button><button className="topbar-icon" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button></div></header>
        <div className="content-wrap">{children}</div>
      </main>
    </div>
  );
}

function ParentView() {
  const [tab, setTab] = useState<ParentTab>("home");
  const [showAlert, setShowAlert] = useState(true);
  const [verified, setVerified] = useState(false);
  const [absence, setAbsence] = useState(false);
  const [toast, setToast] = useState("");
  const events = useMemo(() => verified ? baseTimeline.map((event, index) => index === 2 ? { ...event, state: "done" as const, detail: "Countersigned by Priya at gate 2" } : event) : baseTimeline, [verified]);

  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const navItems: { key: ParentTab; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Overview", icon: <Layers3 size={16} /> },
    { key: "track", label: "Track trip", icon: <Navigation size={16} /> },
    { key: "alerts", label: "Alerts", icon: <Bell size={16} /> },
    { key: "billing", label: "Billing", icon: <CreditCard size={16} /> },
  ];
  return <>
    <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-mark" /> Tuesday · 16 September 2026</div><h1>{tab === "home" ? "Good morning, Ananya" : tab === "track" ? "Aarav's live trip" : tab === "alerts" ? "Your alert centre" : "Household billing"}</h1><p>{tab === "home" ? "One clear answer first: your child is safe right now." : tab === "track" ? "A quiet timeline of the moments that matter." : tab === "alerts" ? "Reason-coded updates, never notification noise." : "Simple, transparent school commute payments."}</p></div><div className="heading-actions"><button className="quiet-button" onClick={() => flash("Help desk is staffed · typical response under 90 sec")}><CircleHelp size={16} /> Help desk</button><button className="avatar-button">AS</button></div></div>
    <nav className="section-tabs">{navItems.map((item) => <button className={tab === item.key ? "section-tab tab-active" : "section-tab"} key={item.key} onClick={() => setTab(item.key)}>{item.icon}{item.label}{item.key === "alerts" && <span className="tab-badge">1</span>}</button>)}</nav>
    {tab === "home" && <>
      {showAlert && <div className="notice-banner"><div className="notice-leading"><div className="notice-symbol"><Radio size={17} /></div><div><strong>Morning ride is on schedule</strong><p>Van 04 is 2 minutes from the school corridor. Next meaningful update at gate handoff.</p></div></div><button className="notice-close" onClick={() => setShowAlert(false)} aria-label="Dismiss alert"><X size={17} /></button></div>}
      <section className="hero-grid"><div className="safe-card"><div className="safe-card-header"><div><div className="card-kicker">CURRENT TRIP · MORNING</div><div className="safe-title"><span className="safe-check"><CheckCircle2 size={23} /></span><span>Safe & in motion</span></div></div><StatusPill tone="green">Verified so far</StatusPill></div><div className="safe-meta"><div className="child-row"><div className="child-avatar">AR</div><div><strong>Aarav Sharma</strong><span>Class 3B · The Shri Ram School</span></div></div><div className="eta-block"><span>Arriving in</span><strong>18 <small>min</small></strong><span>ETA 07:52</span></div></div><div className="safe-divider" /><div className="crew-row"><div className="crew-avatars"><div className="crew-avatar driver-avatar">RM</div><div className="crew-avatar attendant-avatar">SK</div></div><div className="crew-copy"><strong>Locked crew · Van 04</strong><span>Ramesh Kumar + Sunita K.</span></div><div className="capacity-chip"><Users size={15} /><span><strong>9</strong> / 12 seats</span></div></div><div className="safe-actions"><button className="primary-button" onClick={() => setTab("track")}><Navigation size={16} /> View live trip <ArrowRight size={16} /></button><button className="secondary-button" onClick={() => flash("Message sent to Sunita · she will reply when parked")}><MessageCircle size={16} /> Message crew</button></div></div><div className="route-card"><div className="card-title-row"><div><div className="card-kicker">ROUTE CORRIDOR</div><h3>Sector 43 → TSRS gate 2</h3></div><span className="live-label"><span className="live-pulse" /> live</span></div><RouteIllustration /><div className="route-footer"><span><Clock3 size={15} /> 18 min remaining</span><span><LockKeyhole size={14} /> Corridor locked</span></div></div></section>
      <section className="content-grid"><div className="panel timeline-panel"><div className="panel-heading"><div><div className="card-kicker">CUSTODY LEDGER</div><h2>Today’s handoffs</h2></div><button className="icon-button" onClick={() => flash("Ledger exported for this trip")} aria-label="Export ledger"><Download size={16} /></button></div><p className="panel-intro">Every transfer is recorded and independently confirmed. No silent closure.</p><Timeline events={events} onVerify={() => { setVerified(true); flash("Gate handoff marked for review"); }} /><div className="ledger-footer"><span><LockKeyhole size={14} /> Data is purpose-limited · last sync 07:34:12</span><button className="text-action" onClick={() => setTab("alerts")}>See all alerts <ArrowRight size={14} /></button></div></div><div className="side-stack"><div className="panel pod-panel"><div className="panel-heading"><div><div className="card-kicker">YOUR POD</div><h2>Familiar faces</h2></div><button className="icon-button" onClick={() => flash("Pod roster is fixed for this route")}> <MoreHorizontal size={16} /></button></div><div className="pod-member"><div className="pod-avatar pod-blue">RM</div><div><strong>Ramesh Kumar</strong><span>Driver · verified 12 Sep</span></div><ShieldCheck size={16} className="verified-icon" /></div><div className="pod-member"><div className="pod-avatar pod-gold">SK</div><div><strong>Sunita Khatri</strong><span>Attendant · safeguarding trained</span></div><ShieldCheck size={16} className="verified-icon" /></div><div className="pod-member"><div className="pod-avatar pod-green">NV</div><div><strong>Neha Verma</strong><span>Backup crew · on call today</span></div><span className="backup-dot" /></div><button className="full-width-button" onClick={() => flash("Crew record includes checks, training, and incident history")}>View crew record <ArrowRight size={15} /></button></div><div className="panel quiet-panel"><div className="quiet-panel-icon"><Bell size={17} /></div><div><strong>Calm tracking is on</strong><p>We’ll send only 5 meaningful updates today. You’ll hear from us when the status changes.</p></div><span className="toggle-on" /></div></div></section>
      <section className="bottom-grid"><div className="panel child-panel"><div className="panel-heading"><div><div className="card-kicker">HOUSEHOLD</div><h2>Children & schedules</h2></div><button className="text-action" onClick={() => flash("Add child flow opens after verification")}>Manage <ArrowRight size={14} /></button></div><div className="child-table"><div className="child-table-head"><span>CHILD</span><span>ROUTE</span><span>THIS MONTH</span></div><div className="child-table-row"><div className="table-person"><div className="child-avatar small">AR</div><div><strong>Aarav Sharma</strong><span>Class 3B</span></div></div><span>Morning + return</span><strong>₹4,000 <small>/ month</small></strong></div><div className="child-table-row"><div className="table-person"><div className="child-avatar small second">IK</div><div><strong>Ira Sharma</strong><span>Class 1A · waitlist</span></div></div><span className="muted-text">Not yet riding</span><StatusPill tone="amber">Waitlist</StatusPill></div></div></div><div className="panel credit-panel"><div className="credit-orbit"><IndianRupee size={20} /></div><div className="card-kicker">ABSENCE CREDIT</div><strong>₹267.00 available</strong><p>From 1 cancelled school day. Applied automatically on your next invoice.</p><button className="text-action" onClick={() => setTab("billing")}>View billing <ArrowRight size={14} /></button></div></section>
      <section className="recent-section"><div className="panel-heading"><div><div className="card-kicker">RECENT TRIPS</div><h2>Trust, built one day at a time</h2></div><button className="text-action" onClick={() => setTab("track")}>Open history <ArrowRight size={14} /></button></div><div className="trip-list">{quickTrips.map((trip) => <div className="trip-row" key={`${trip.date}-${trip.route}`}><div className="trip-date">{trip.date}</div><div className="trip-route"><span className="trip-route-dot" /><div><strong>{trip.route}</strong><span>{trip.meta}</span></div></div><StatusPill tone={trip.tone}>{trip.status}</StatusPill><ChevronRight size={16} className="muted-icon" /></div>)}</div></section>
    </>}
    {tab === "track" && <TrackView onBack={() => setTab("home")} verified={verified} />}
    {tab === "alerts" && <AlertsView onBack={() => setTab("home")} absence={absence} setAbsence={setAbsence} flash={flash} />}
    {tab === "billing" && <BillingView flash={flash} />}
    {toast && <div className="toast"><CheckCircle2 size={16} />{toast}</div>}
  </>;
}

function TrackView({ onBack, verified }: { onBack: () => void; verified: boolean }) {
  return <div className="detail-layout"><div className="detail-main"><button className="back-link" onClick={onBack}>← Back to overview</button><div className="detail-heading-row"><div><div className="eyebrow"><span className="eyebrow-mark" /> LIVE TRIP · MORNING</div><h2>Home → The Shri Ram School</h2><p>Tuesday, 16 September · scheduled 07:10–07:52</p></div><StatusPill tone="green">{verified ? "Handoff verified" : "In motion"}</StatusPill></div><div className="large-map"><RouteIllustration /><div className="map-callout"><div className="callout-pulse" /><div><strong>Van 04 is moving normally</strong><span>Last verified 07:34:12 · 2 min ahead of schedule</span></div></div></div><div className="panel detail-timeline"><div className="panel-heading"><div><div className="card-kicker">VERIFIED JOURNEY</div><h2>Four custody points</h2></div><span className="muted-stamp">Synced just now</span></div><Timeline events={verified ? baseTimeline.map((event, index) => index === 2 ? { ...event, state: "done" as const, detail: "Countersigned by Priya at gate 2" } : event) : baseTimeline} onVerify={() => undefined} /></div></div><div className="detail-side"><div className="panel side-status-card"><div className="side-card-top"><span className="status-icon-green"><ShieldCheck size={20} /></span><StatusPill tone="green">No exception</StatusPill></div><h3>Your child is safe right now.</h3><p>The latest system event and human confirmation agree.</p><div className="side-metric"><span>Current ETA</span><strong>07:52</strong></div><div className="side-metric"><span>Cabin count</span><strong>9 <small>/ 12</small></strong></div><div className="side-metric"><span>Route deviation</span><strong>0.0 km</strong></div></div><div className="panel action-card"><div className="card-kicker">NEED HELP?</div><h3>A human is one tap away.</h3><p>For an urgent concern, contact the staffed control room. We do not make the child manage the emergency flow.</p><button className="primary-button full" onClick={() => window.alert("Control room call simulation: connected to Safety Desk · +91 124 555 0188")}><Phone size={16} /> Call safety desk</button><button className="secondary-button full" onClick={() => window.alert("Message composer opened for the control room.")}><MessageCircle size={16} /> Send a message</button></div></div></div>;
}

function AlertsView({ onBack, absence, setAbsence, flash }: { onBack: () => void; absence: boolean; setAbsence: (value: boolean) => void; flash: (message: string) => void }) {
  return <div className="detail-layout"><div className="detail-main"><button className="back-link" onClick={onBack}>← Back to overview</button><div className="detail-heading-row"><div><div className="eyebrow"><span className="eyebrow-mark" /> NOTIFICATION CENTRE</div><h2>Meaningful updates only</h2><p>Your daily notification ceiling is visible and in your control.</p></div><div className="notification-counter"><strong>{absence ? "2" : "1"}</strong><span>/ 5 used today</span></div></div><div className="panel alert-list"><div className="alert-item alert-success"><IconBadge tone="green"><CheckCircle2 size={18} /></IconBadge><div><div className="alert-item-top"><strong>Morning ride is on schedule</strong><span>07:34</span></div><p>Van 04 departed with 9 of 9 children checked in. Next update at school gate handoff.</p><StatusPill tone="green">Resolved</StatusPill></div></div><div className="alert-item alert-info"><IconBadge tone="blue"><Info size={18} /></IconBadge><div><div className="alert-item-top"><strong>School gate handoff pending</strong><span>07:34</span></div><p>The crew has a clear ETA. A school staff member will countersign when the van arrives.</p><StatusPill tone="blue">In progress</StatusPill></div></div>{absence && <div className="alert-item alert-success"><IconBadge tone="green"><IndianRupee size={18} /></IconBadge><div><div className="alert-item-top"><strong>Absence recorded · credit issued</strong><span>06:42</span></div><p>Aarav was removed from today’s manifest. ₹267 will be applied to your next invoice.</p><StatusPill tone="green">Complete</StatusPill></div></div>}</div><div className="exception-callout"><div className="exception-icon"><AlertTriangle size={18} /></div><div><strong>Test a recovery state</strong><p>See what happens when your child is absent. The manifest, headcount, and billing record update together.</p><button className="secondary-button" onClick={() => { setAbsence(!absence); flash(absence ? "Absence test reset" : "Absence recorded · manifest updated"); }}>{absence ? "Reset test state" : "Mark child absent"}</button></div></div></div><div className="detail-side"><div className="panel notification-settings"><div className="card-kicker">CALM TRACKING</div><h3>What we’ll tell you</h3><div className="setting-row"><div><strong>Handoff milestones</strong><span>Always on</span></div><span className="toggle-on" /></div><div className="setting-row"><div><strong>Late or route change</strong><span>Reason-coded</span></div><span className="toggle-on" /></div><div className="setting-row"><div><strong>Every GPS update</strong><span>Never sent</span></div><span className="toggle-off" /></div><div className="setting-row"><div><strong>Daily ceiling</strong><span>5 meaningful updates</span></div><span className="ceiling-value">5</span></div></div><div className="panel privacy-mini"><LockKeyhole size={17} /><div><strong>Your data, purpose-limited</strong><p>We show the last verified event—not an invented location. AI assistance receives event-log text only.</p></div></div></div></div>;
}

function BillingView({ flash }: { flash: (message: string) => void }) {
  return <div className="billing-layout"><div className="billing-main"><div className="detail-heading-row"><div><div className="eyebrow"><span className="eyebrow-mark" /> HOUSEHOLD PAYMENTS</div><h2>Simple, transparent billing</h2><p>No cash collection for crews. Credits are applied automatically.</p></div><button className="secondary-button" onClick={() => flash("Invoice PDF queued for download")}><Download size={15} /> Download invoice</button></div><div className="billing-total panel"><div><span className="card-kicker">SEPTEMBER 2026</span><h3>₹3,733 <small>due on 01 Oct</small></h3><p>₹4,000 Sarathi Van subscription · ₹267 absence credit</p></div><StatusPill tone="blue">Autopay active</StatusPill></div><div className="panel invoice-panel"><div className="panel-heading"><div><div className="card-kicker">PAYMENT ACTIVITY</div><h2>Recent invoices</h2></div><WalletCards size={19} className="muted-icon" /></div><div className="invoice-row"><div className="invoice-icon"><Check size={16} /></div><div><strong>August 2026</strong><span>Paid via HDFC •••• 8842 · 01 Sep</span></div><strong>₹4,000</strong><StatusPill tone="green">Paid</StatusPill></div><div className="invoice-row"><div className="invoice-icon invoice-credit"><IndianRupee size={16} /></div><div><strong>Absence credit</strong><span>1 cancelled day · issued 16 Sep</span></div><strong>− ₹267</strong><StatusPill tone="blue">Applied</StatusPill></div></div></div><div className="billing-side"><div className="panel plan-card"><div className="plan-icon"><Bus size={20} /></div><div className="card-kicker">CURRENT PLAN</div><h3>Sarathi Van</h3><p>Locked crew · up to 12 children · fixed school corridor</p><div className="plan-price"><strong>₹4,000</strong><span>/ month</span></div><button className="full-width-button" onClick={() => flash("Plan changes require a route review by the safety desk")}>Review plan <ArrowRight size={15} /></button></div><div className="panel payment-method"><div className="card-kicker">PAYMENT METHOD</div><div className="card-method"><CreditCard size={18} /><div><strong>HDFC Bank •••• 8842</strong><span>Autopay enabled</span></div><ChevronRight size={16} className="muted-icon" /></div><button className="text-action" onClick={() => flash("Payment method editor opened")}>Manage payment method <ArrowRight size={14} /></button></div></div></div>;
}

function DriverView() {
  const [mode, setMode] = useState(true);
  const [checked, setChecked] = useState([true, true, false]);
  const [scanCount, setScanCount] = useState(9);
  const [toast, setToast] = useState("");
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2500); };
  const checklist = ["Seat belts and child locks checked", "Rear cabin clear before departure", "Route corridor and backup contact reviewed"];
  return <div className="ops-page"><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-mark" /> CREW DASHBOARD · TUESDAY</div><h1>Ready for school mode, Ramesh.</h1><p>Predictable work. Clear steps. No cash chasing.</p></div><div className="mode-switch"><div><span>School Mode</span><small>{mode ? "Active until 08:20" : "Paused"}</small></div><button className={`switch-control ${mode ? "switch-active" : ""}`} onClick={() => setMode(!mode)}><span /></button></div></div><section className="driver-kpis"><div className="metric-card metric-primary"><div className="metric-top"><span>THIS MORNING</span><Sparkles size={16} /></div><strong>₹1,240</strong><span>Guaranteed payout · Van 04</span><Sparkline tone="blue" /></div><div className="metric-card"><div className="metric-top"><span>CHECKED IN</span><Users size={16} /></div><strong>{scanCount} <small>/ 9</small></strong><span>All manifest seats accounted</span><Sparkline tone="green" /></div><div className="metric-card"><div className="metric-top"><span>SAFETY STREAK</span><ShieldCheck size={16} /></div><strong>18 <small>days</small></strong><span>No unresolved exceptions</span><Sparkline tone="amber" /></div><div className="metric-card"><div className="metric-top"><span>WEEKLY RATING</span><HeartHandshake size={16} /></div><strong>4.9 <small>/ 5</small></strong><span>From parent + school feedback</span><Sparkline tone="green" /></div></section><div className="ops-grid"><div className="ops-main"><div className="panel next-trip-panel"><div className="panel-heading"><div><div className="card-kicker">NEXT ROUTE · START 07:10</div><h2>Sector 43 → TSRS gate 2</h2></div><StatusPill tone="blue">Route locked</StatusPill></div><div className="driver-route-strip"><div className="driver-stop"><span className="stop-icon home-stop"><MapPin size={15} /></span><div><strong>Sector 43</strong><span>6 pickups · 07:10–07:28</span></div></div><div className="driver-route-line"><span /><span /><span /></div><div className="driver-stop"><span className="stop-icon school-stop"><Bus size={15} /></span><div><strong>TSRS gate 2</strong><span>Drop-off · 07:52</span></div></div></div><div className="manifest-header"><div><div className="card-kicker">MANIFEST</div><h3>9 children · hard cap 12</h3></div><button className="scan-button" onClick={() => { if (scanCount < 9) setScanCount(scanCount + 1); flash("Check-in scan recorded"); }}><QrCode size={16} /> Scan handoff</button></div><div className="manifest-list">{["Aarav Sharma", "Riya Mehta", "Kabir Singh", "Mehul Jain", "Tara Kapoor"].map((name, i) => <div className="manifest-row" key={name}><div className="manifest-avatar">{name.split(" ").map((x) => x[0]).join("")}</div><div><strong>{name}</strong><span>{i < 3 ? `Pickup ${String.fromCharCode(65 + i)} · ${["07:12", "07:18", "07:23"][i]}` : "Pickup confirmed"}</span></div><span className="manifest-check"><Check size={14} /></span></div>)}<div className="manifest-more">+ 4 more children in manifest <ArrowRight size={14} /></div></div></div><div className="panel checklist-panel"><div className="panel-heading"><div><div className="card-kicker">PRE-DEPARTURE</div><h2>Safety checklist</h2></div><StatusPill tone={checked.every(Boolean) ? "green" : "amber"}>{checked.every(Boolean) ? "Ready" : "1 open"}</StatusPill></div>{checklist.map((item, index) => <button className="checklist-row" key={item} onClick={() => setChecked(checked.map((value, i) => i === index ? !value : value))}><span className={`check-box ${checked[index] ? "check-box-on" : ""}`}>{checked[index] && <Check size={13} />}</span><span>{item}</span><span className="checklist-note">{checked[index] ? "Logged" : "Tap to log"}</span></button>)}<div className="driver-note"><Info size={15} /><span>Anything unusual? Pause the trip and use <strong>Exception support</strong>. Safety gates cannot be overridden silently.</span></div></div></div><div className="ops-side"><div className="panel crew-card"><div className="card-kicker">YOUR POD</div><div className="driver-profile"><div className="large-driver-avatar">RM</div><div><h3>Ramesh Kumar</h3><p>CareDriver · 2 years with Sarathi</p><StatusPill tone="green">Verified crew</StatusPill></div></div><div className="crew-stat-row"><span>Training</span><strong>Expiry · 12 Dec 2026</strong></div><div className="crew-stat-row"><span>Safe routes</span><strong>142 completed</strong></div><button className="full-width-button" onClick={() => flash("Portable safety record opened")}>Open safety record <ArrowRight size={15} /></button></div><div className="panel support-card"><div className="support-icon"><LifeBuoy size={19} /></div><div><div className="card-kicker">STAFFED SUPPORT</div><h3>Need a hand?</h3><p>Sunita and the safety desk can see this route.</p></div><button className="secondary-button full" onClick={() => flash("Safety desk alerted with route context")}>Raise an exception</button></div><div className="payout-card"><IndianRupee size={17} /><div><strong>₹8,640</strong><span>Next weekly payout · Friday</span></div><ArrowRight size={15} /></div></div></div>{toast && <div className="toast"><CheckCircle2 size={16} />{toast}</div>}</div>;
}

function SchoolView() {
  const [gateOpen, setGateOpen] = useState(false);
  const [selected, setSelected] = useState("Van 04");
  return <div className="ops-page"><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-mark" /> SCHOOL CONSOLE · GATE 2</div><h1>Dismissal, with a record.</h1><p>Scan the crew. Confirm the child. Countersign the handoff.</p></div><div className="school-badge"><div className="school-badge-mark">TS</div><div><strong>The Shri Ram School</strong><span>Aravali campus · Gurugram</span></div></div></div><div className="school-banner"><div className="school-banner-icon"><ShieldCheck size={21} /></div><div><strong>School Mode is ready</strong><p>Gate 2 is open for scheduled crews. Only approved route pods appear here.</p></div><StatusPill tone="green">2 arrivals due</StatusPill></div><div className="school-grid"><div className="school-main"><div className="panel gate-panel"><div className="panel-heading"><div><div className="card-kicker">ARRIVAL QUEUE · 07:45–08:05</div><h2>Today’s school handoffs</h2></div><button className="scan-button" onClick={() => setGateOpen(!gateOpen)}><ScanLine size={16} /> {gateOpen ? "Gate scanner open" : "Open gate scanner"}</button></div>{gateOpen && <div className="scanner-drawer"><div className="scanner-animation"><ScanLine size={31} /></div><div><strong>Scanner ready</strong><p>Hold crew QR or school ID inside the frame.</p></div><button onClick={() => setGateOpen(false)}><X size={16} /></button></div>}<div className="arrival-row arrival-selected" onClick={() => setSelected("Van 04")}><div className="arrival-time"><strong>07:52</strong><span>in 18 min</span></div><div className="arrival-vehicle"><div className="vehicle-avatar"><Bus size={18} /></div><div><strong>Van 04 · Sector 43 corridor</strong><span>Ramesh Kumar + Sunita K. · 9 children</span></div></div><div className="arrival-status"><StatusPill tone="blue">Approaching</StatusPill><ChevronRight size={16} /></div></div><div className="arrival-row" onClick={() => setSelected("Cab 02")}><div className="arrival-time"><strong>08:01</strong><span>in 27 min</span></div><div className="arrival-vehicle"><div className="vehicle-avatar vehicle-gold"><Bus size={18} /></div><div><strong>Cab 02 · Golf Course Road</strong><span>Arjun S. · 3 children · attendant on request</span></div></div><div className="arrival-status"><StatusPill tone="slate">Scheduled</StatusPill><ChevronRight size={16} /></div></div></div><div className="panel handoff-panel"><div className="panel-heading"><div><div className="card-kicker">SELECTED POD · {selected}</div><h2>Gate handoff log</h2></div><span className="muted-stamp">School witness</span></div><div className="handoff-steps"><div className="handoff-step step-done"><div className="step-circle"><Check size={14} /></div><div><strong>Crew identity verified</strong><span>QR matched · 07:50</span></div></div><div className="handoff-step step-done"><div className="step-circle"><Check size={14} /></div><div><strong>Manifest reconciled</strong><span>9 children · 9 bands detected</span></div></div><div className="handoff-step"><div className="step-circle"><span>3</span></div><div><strong>School countersignature</strong><span>Required when vehicle arrives at gate 2</span></div><button className="primary-button compact" onClick={() => window.alert("Handoff countersigned by Priya Nair · Gate 2")}>Countersign <Check size={14} /></button></div></div></div></div><div className="school-side"><div className="panel school-metric"><div className="metric-top"><span>VERIFIED TODAY</span><CheckCircle2 size={16} /></div><strong>16 <small>/ 18</small></strong><span>handoffs complete</span><div className="progress-track"><div className="progress-fill" style={{ width: "89%" }} /></div></div><div className="panel school-metric"><div className="metric-top"><span>OPEN EXCEPTIONS</span><AlertTriangle size={16} /></div><strong>1</strong><span>late route · acknowledged</span><button className="text-action" onClick={() => window.alert("Exception: Cab 02 delayed 4 min due to traffic. Human review complete.")}>Review exception <ArrowRight size={14} /></button></div><div className="panel school-trust"><div className="trust-illustration"><Users size={20} /></div><div className="card-kicker">THE SAME LOG</div><h3>Parents see what you confirm.</h3><p>School participation closes the dark window without requiring a child to explain what happened.</p></div></div></div></div>;
}

function ControlRoomView() {
  const [active, setActive] = useState("Van 04");
  const [resolved, setResolved] = useState(false);
  return <div className="ops-page"><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-mark" /> CONTROL ROOM · 07:34 IST</div><h1>Good morning, safety desk.</h1><p>Watch exceptions, not every dot. Human control stays in the loop.</p></div><div className="control-status"><span className="status-dot" /> 3 operators online</div></div><div className="control-kpis"><div className="control-kpi"><span>LIVE PODS</span><strong>12</strong><small>11 normal · 1 watch</small></div><div className="control-kpi"><span>VERIFIED HANDOFFS</span><strong>98.7%</strong><small>Today · target ≥ 99.5%</small></div><div className="control-kpi"><span>OPEN EXCEPTIONS</span><strong className={resolved ? "green-number" : "amber-number"}>{resolved ? "0" : "1"}</strong><small>{resolved ? "All clear" : "Requires acknowledgement"}</small></div><div className="control-kpi"><span>SOS RESPONSE</span><strong>42s</strong><small>Rolling 7-day average</small></div></div><div className="control-layout"><div className="control-main"><div className="panel control-map-panel"><div className="panel-heading"><div><div className="card-kicker">PILOT POCKET · GURUGRAM</div><h2>Live route overview</h2></div><div className="map-controls"><button className="map-control-active">All pods</button><button>Exceptions</button></div></div><div className="control-map"><RouteIllustration /><div className="mini-pod pod-a"><Bus size={13} /> 04</div><div className="mini-pod pod-b"><Bus size={13} /> 02</div><div className="mini-pod pod-c"><Bus size={13} /> 07</div><div className="map-ops-label"><span className="legend-dot" /> 12 active pods <span className="legend-line" /> fixed corridors</div></div></div><div className="panel event-feed"><div className="panel-heading"><div><div className="card-kicker">EVENT STREAM</div><h2>Requires human attention</h2></div><StatusPill tone={resolved ? "green" : "amber"}>{resolved ? "No open issues" : "1 open issue"}</StatusPill></div>{!resolved && <div className="event-card event-warning"><IconBadge tone="amber"><AlertTriangle size={18} /></IconBadge><div className="event-card-content"><div className="event-card-title"><strong>Cab 02 · route delay</strong><span>07:32 · 2 min ago</span></div><p>ETA slipped 4 minutes on Golf Course Road. Reason code suggested: traffic. No corridor deviation.</p><div className="event-actions"><button className="primary-button compact" onClick={() => setResolved(true)}><Check size={14} /> Acknowledge & notify</button><button className="text-action" onClick={() => window.alert("AI assist: Deterministic delay rule fired at 07:31:40. Source: ETA model + GPS corridor event.") }><Sparkles size={14} /> View assist reasoning</button></div></div></div>}<div className="event-card event-normal"><IconBadge tone="green"><CheckCircle2 size={18} /></IconBadge><div className="event-card-content"><div className="event-card-title"><strong>Van 04 · morning boarding complete</strong><span>07:34 · just now</span></div><p>9 of 9 children checked in. Cabin count matches manifest. Route corridor locked.</p></div></div><div className="event-card event-normal"><IconBadge tone="blue"><FileCheck2 size={18} /></IconBadge><div className="event-card-content"><div className="event-card-title"><strong>Van 07 · crew check refreshed</strong><span>07:29</span></div><p>Driver identity and vehicle documents are valid through 12 Dec 2026.</p></div></div></div></div><div className="control-side"><div className="panel assist-panel"><div className="assist-header"><div className="assist-spark"><Sparkles size={16} /></div><div><div className="card-kicker">LOCAL ASSIST</div><h3>AI explains. You decide.</h3></div></div><p>Assist reads minimum event-log text after deterministic checks. It never sees cabin media or closes an exception on its own.</p><div className="assist-rule"><span>Trigger</span><strong>ETA threshold</strong></div><div className="assist-rule"><span>Source event</span><strong>GPS + schedule · 07:31</strong></div><div className="assist-rule"><span>Suggested action</span><strong>Notify parent with reason</strong></div><button className="secondary-button full" onClick={() => window.alert("Assist audit: model response linked to rule event, operator decision, and timestamp.")}>Open assist audit <ArrowRight size={15} /></button></div><div className="panel active-pod-panel"><div className="panel-heading"><div><div className="card-kicker">ACTIVE PODS</div><h2>At a glance</h2></div><button className="icon-button" aria-label="More pods"><MoreHorizontal size={16} /></button></div>{["Van 04 · 9/9", "Cab 02 · 3/3", "Van 07 · 10/10"].map((pod, index) => <button className={`active-pod-row ${active === pod.split(" · ")[0] ? "pod-row-active" : ""}`} key={pod} onClick={() => setActive(pod.split(" · ")[0])}><span className={`pod-status-dot ${index === 1 && !resolved ? "pod-watch" : ""}`} /><span><strong>{pod}</strong><small>{index === 1 && !resolved ? "Traffic delay · acknowledged soon" : "Corridor normal · last scan 2m ago"}</small></span><ChevronRight size={15} /></button>)}</div><div className="privacy-mini control-privacy"><LockKeyhole size={17} /><div><strong>DPDP-aware controls on</strong><p>Purpose limitation · retention window · manual fallback</p></div></div></div></div></div>;
}

export default function Home() {
  const [role, setRole] = useState<Role>("parent");
  const [dark, setDark] = useState(false);
  return <Shell role={role} setRole={setRole} dark={dark} setDark={setDark}>{role === "parent" ? <ParentView /> : role === "driver" ? <DriverView /> : role === "school" ? <SchoolView /> : <ControlRoomView />}</Shell>;
}
