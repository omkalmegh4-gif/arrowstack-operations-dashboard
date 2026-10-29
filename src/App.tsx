import { useMemo, useState, type FormEvent } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Download,
  Plus,
  Search,
  Users,
  Wallet,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Status = "On track" | "At risk" | "Delayed";
type RecordRow = { id: string; team: string; owner: string; status: Status; progress: number; updated: string };
type View = "Overview" | "Initiatives" | "Teams" | "Reports" | "Settings";
type Preferences = { workspaceName: string; weeklySummary: boolean; priorityAlerts: boolean };

const initialRecords: RecordRow[] = [
  { id: "OPS-104", team: "Customer success", owner: "A. Shah", status: "On track", progress: 86, updated: "Today" },
  { id: "OPS-105", team: "Platform", owner: "R. Patil", status: "At risk", progress: 58, updated: "Today" },
  { id: "OPS-106", team: "Fulfilment", owner: "M. Rao", status: "Delayed", progress: 32, updated: "Yesterday" },
  { id: "OPS-107", team: "Growth", owner: "S. Joshi", status: "On track", progress: 91, updated: "Yesterday" },
  { id: "OPS-108", team: "Finance", owner: "K. Deshmukh", status: "At risk", progress: 64, updated: "2 days ago" },
  { id: "OPS-109", team: "Platform", owner: "N. More", status: "On track", progress: 78, updated: "2 days ago" },
];

const trend = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 48 },
  { month: "Mar", value: 45 },
  { month: "Apr", value: 57 },
  { month: "May", value: 62 },
  { month: "Jun", value: 68 },
];

const views: View[] = ["Overview", "Initiatives", "Teams", "Reports", "Settings"];

function filterRecords(records: RecordRow[], query: string, status: string) {
  const normalizedQuery = query.trim().toLowerCase();
  return records.filter(
    (record) =>
      (status === "All" || record.status === status) &&
      `${record.id} ${record.team} ${record.owner}`.toLowerCase().includes(normalizedQuery),
  );
}

function RecordFilters({
  query,
  onQueryChange,
  status,
  onStatusChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}) {
  return (
    <div className="toolbar record-filters">
      <label className="search-field">
        <Search size={17} aria-hidden="true" />
        <span className="sr-only">Search records</span>
        <input
          className="search-input"
          aria-label="Search records"
          placeholder="Search by ID, team, or owner..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
      <label>
        <span className="sr-only">Filter status</span>
        <select
          className="search-input"
          aria-label="Filter status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option>All</option>
          <option>On track</option>
          <option>At risk</option>
          <option>Delayed</option>
        </select>
      </label>
    </div>
  );
}

function RecordTable({ records }: { records: RecordRow[] }) {
  if (records.length === 0) {
    return <div className="empty" role="status">No records match these filters.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Team</th>
            <th scope="col">Owner</th>
            <th scope="col">Status</th>
            <th scope="col">Progress</th>
            <th scope="col">Updated</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td><strong>{record.id}</strong></td>
              <td>{record.team}</td>
              <td>{record.owner}</td>
              <td>
                <span className={`pill status-pill status-${record.status.toLowerCase().replace(" ", "-")}`}>
                  {record.status}
                </span>
              </td>
              <td className="progress-cell">
                <div className="progress" role="progressbar" aria-label={`${record.team} progress`} aria-valuenow={record.progress} aria-valuemin={0} aria-valuemax={100}>
                  <span style={{ width: `${record.progress}%` }} />
                </div>
                <span>{record.progress}%</span>
              </td>
              <td>{record.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportingPeriod({
  period,
  onChange,
}: {
  period: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="period-control">
      <span className="eyebrow">Reporting period</span>
      <select className="search-input" aria-label="Reporting period" value={period} onChange={(event) => onChange(event.target.value)}>
        <option>Last 6 months</option>
        <option>Last 30 days</option>
        <option>This quarter</option>
      </select>
    </label>
  );
}

function TrendChart({ period }: { period: string }) {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <h2>Performance trend</h2>
          <span className="muted chart-caption">{period} · illustrative index</span>
        </div>
        <span className="pill">Trend</span>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend}>
            <defs>
              <linearGradient id="fillOps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7086ed" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#7086ed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} width={30} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#657ce0" fill="url(#fillOps)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function App() {
  const [activeView, setActiveView] = useState<View>("Overview");
  const [records, setRecords] = useState(initialRecords);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [period, setPeriod] = useState("Last 6 months");
  const [showInitiativeForm, setShowInitiativeForm] = useState(false);
  const [initiativeName, setInitiativeName] = useState("");
  const [initiativeOwner, setInitiativeOwner] = useState("");
  const [initiativeStatus, setInitiativeStatus] = useState<Status>("On track");
  const [preferences, setPreferences] = useState<Preferences>({
    workspaceName: "Arrowstack",
    weeklySummary: true,
    priorityAlerts: true,
  });
  const [settingsMessage, setSettingsMessage] = useState("");

  const filteredRecords = useMemo(() => filterRecords(records, query, status), [records, query, status]);
  const teamSummaries = useMemo(() => {
    const teams = new Map<string, RecordRow[]>();
    records.forEach((record) => teams.set(record.team, [...(teams.get(record.team) ?? []), record]));
    return Array.from(teams.entries()).map(([team, teamRecords]) => ({
      name: team,
      records: teamRecords,
      owners: Array.from(new Set(teamRecords.map((record) => record.owner))),
      averageProgress: Math.round(teamRecords.reduce((sum, record) => sum + record.progress, 0) / teamRecords.length),
      attentionCount: teamRecords.filter((record) => record.status !== "On track").length,
    }));
  }, [records]);

  function navigateTo(view: View) {
    setActiveView(view);
    setQuery("");
    setStatus("All");
    setShowInitiativeForm(false);
  }

  function addInitiative(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextNumber = Math.max(103, ...records.map((record) => Number(record.id.replace("OPS-", "")))) + 1;
    setRecords((current) => [
      ...current,
      {
        id: `OPS-${nextNumber}`,
        team: initiativeName.trim(),
        owner: initiativeOwner.trim(),
        status: initiativeStatus,
        progress: 0,
        updated: "Just now",
      },
    ]);
    setInitiativeName("");
    setInitiativeOwner("");
    setInitiativeStatus("On track");
    setShowInitiativeForm(false);
  }

  function exportReport() {
    const rows = [
      ["ID", "Team", "Owner", "Status", "Progress", "Updated"],
      ...filteredRecords.map((record) => [record.id, record.team, record.owner, record.status, `${record.progress}%`, record.updated]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "arrowstack-operations-report.csv";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextPreferences = { ...preferences, workspaceName: preferences.workspaceName.trim() || "Arrowstack" };
    setPreferences(nextPreferences);
    setSettingsMessage("Settings saved for this browser session.");
  }

  function updatePreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    setPreferences((current) => ({ ...current, [key]: value }));
    setSettingsMessage("");
  }

  const stats = [
    { label: "Operational score", value: "86.4%", change: "+4.2%", icon: <Activity aria-hidden="true" />, positive: true },
    { label: "Active initiatives", value: String(records.length), change: "Tracked in this demo", icon: <CheckCircle2 aria-hidden="true" />, positive: true },
    { label: "Team capacity", value: "78%", change: "−2.1%", icon: <Users aria-hidden="true" />, positive: false },
    { label: "Budget utilization", value: "64%", change: "Within plan", icon: <Wallet aria-hidden="true" />, positive: true },
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">A</span>
          <span>
            {preferences.workspaceName}<span className="brand-section"> / Ops</span>
            <small className="muted brand-caption">Operations workspace · illustrative data</small>
          </span>
        </div>
        <span className="pill">DEMO DATA</span>
      </header>

      <div className="dashboard-layout">
        <aside className="panel sidebar">
          <p className="eyebrow">Workspace</p>
          <nav aria-label="Workspace">
            {views.map((view) => (
              <button
                className={`nav-item${activeView === view ? " active" : ""}`}
                key={view}
                type="button"
                aria-current={activeView === view ? "page" : undefined}
                onClick={() => navigateTo(view)}
              >
                {view}
              </button>
            ))}
          </nav>
          <p className="muted sidebar-note">Sample interface. Values are illustrative, not live business metrics.</p>
        </aside>

        <main className="dashboard-main">
          <p className="eyebrow">Monday · {activeView === "Overview" ? "Executive summary" : "Workspace"}</p>
          <div className="section-head page-heading">
            <div>
              <h1 className="page-title">{activeView === "Overview" ? "Operations overview" : activeView}</h1>
              <p className="lead page-description">
                {activeView === "Overview" && "Understand performance, spot risk, and review work in progress."}
                {activeView === "Initiatives" && "Track initiative owners, progress, and delivery status."}
                {activeView === "Teams" && "Review team progress and jump into the work that needs attention."}
                {activeView === "Reports" && "Review a summary of demo performance and export the current records."}
                {activeView === "Settings" && "Customize the name and notification preferences for this demo workspace."}
              </p>
            </div>
            {(activeView === "Overview" || activeView === "Reports") && (
              <ReportingPeriod period={period} onChange={setPeriod} />
            )}
          </div>

          <div className="notice" role="note">
            <AlertTriangle size={17} aria-hidden="true" />
            <span>Demo dashboard: all figures and records below are mock data for UI demonstration.</span>
          </div>

          {activeView === "Overview" && (
            <>
              <div className="grid grid-4 stats-grid">
                {stats.map((stat) => (
                  <article className="panel" key={stat.label}>
                    <div className="stat-icons">
                      <span>{stat.icon}</span>
                      <span className={stat.positive ? "positive-change" : "negative-change"}>
                        {stat.positive ? <ArrowUpRight size={16} aria-hidden="true" /> : <ArrowDownRight size={16} aria-hidden="true" />}
                      </span>
                    </div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                    <p className={stat.positive ? "positive-change stat-change" : "negative-change stat-change"}>{stat.change}</p>
                  </article>
                ))}
              </div>

              <div className="grid grid-2 content-grid">
                <TrendChart period={period} />
                <section className="panel attention-panel">
                  <h2>Attention required</h2>
                  <p className="muted">Items with a status that may need follow-up.</p>
                  {records.filter((record) => record.status !== "On track").map((record) => (
                    <div className="attention-row" key={record.id}>
                      <span className={record.status === "Delayed" ? "delayed-icon" : "risk-icon"}>
                        <AlertTriangle size={20} aria-hidden="true" />
                      </span>
                      <div className="attention-info">
                        <strong>{record.team}</strong>
                        <div className="muted">{record.id} · {record.owner}</div>
                      </div>
                      <span className="pill">{record.status}</span>
                    </div>
                  ))}
                </section>
              </div>

              <section className="panel section-panel">
                <div className="section-head">
                  <div>
                    <h2>Initiative tracker</h2>
                    <p className="muted section-subtitle">Search by ID, team, or owner.</p>
                  </div>
                  <span className="pill">{filteredRecords.length} records</span>
                </div>
                <RecordFilters query={query} onQueryChange={setQuery} status={status} onStatusChange={setStatus} />
                <RecordTable records={filteredRecords} />
              </section>
            </>
          )}

          {activeView === "Initiatives" && (
            <section className="panel section-panel">
              <div className="section-head">
                <div>
                  <h2>Initiative tracker</h2>
                  <p className="muted section-subtitle">Add an initiative or filter the list by ID, team, owner, or status.</p>
                </div>
                <button className="btn" type="button" onClick={() => setShowInitiativeForm((show) => !show)}>
                  <Plus size={17} aria-hidden="true" /> {showInitiativeForm ? "Cancel" : "Add initiative"}
                </button>
              </div>

              {showInitiativeForm && (
                <form className="initiative-form" onSubmit={addInitiative}>
                  <label className="field">
                    <span>Initiative / team name</span>
                    <input autoFocus required maxLength={60} value={initiativeName} onChange={(event) => setInitiativeName(event.target.value)} placeholder="e.g. Customer research" />
                  </label>
                  <label className="field">
                    <span>Owner</span>
                    <input required maxLength={60} value={initiativeOwner} onChange={(event) => setInitiativeOwner(event.target.value)} placeholder="e.g. A. Shah" />
                  </label>
                  <label className="field">
                    <span>Status</span>
                    <select value={initiativeStatus} onChange={(event) => setInitiativeStatus(event.target.value as Status)}>
                      <option>On track</option>
                      <option>At risk</option>
                      <option>Delayed</option>
                    </select>
                  </label>
                  <button className="btn form-submit" type="submit">Create initiative</button>
                </form>
              )}

              <div className="section-head list-summary">
                <span className="muted">{filteredRecords.length} of {records.length} initiatives</span>
              </div>
              <RecordFilters query={query} onQueryChange={setQuery} status={status} onStatusChange={setStatus} />
              <RecordTable records={filteredRecords} />
            </section>
          )}

          {activeView === "Teams" && (
            <section className="grid grid-2 team-grid">
              {teamSummaries.map((team) => (
                <article className="panel team-card" key={team.name}>
                  <div className="team-heading">
                    <div className="team-avatar" aria-hidden="true">{team.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <h2>{team.name}</h2>
                      <p className="muted team-owners">Owner{team.owners.length === 1 ? "" : "s"}: {team.owners.join(", ")}</p>
                    </div>
                  </div>
                  <div className="team-metrics">
                    <div><strong>{team.records.length}</strong><span>initiative{team.records.length === 1 ? "" : "s"}</span></div>
                    <div><strong>{team.averageProgress}%</strong><span>avg. progress</span></div>
                    <div><strong>{team.attentionCount}</strong><span>need attention</span></div>
                  </div>
                  <div className="progress team-progress" role="progressbar" aria-label={`${team.name} average progress`} aria-valuenow={team.averageProgress} aria-valuemin={0} aria-valuemax={100}>
                    <span style={{ width: `${team.averageProgress}%` }} />
                  </div>
                  <button
                    className="btn secondary team-action"
                    type="button"
                    onClick={() => {
                      setQuery(team.name);
                      setStatus("All");
                      setActiveView("Initiatives");
                    }}
                  >
                    View initiatives
                  </button>
                </article>
              ))}
            </section>
          )}

          {activeView === "Reports" && (
            <>
              <div className="grid grid-3 report-metrics">
                <article className="panel report-metric"><span className="muted">Total initiatives</span><strong>{records.length}</strong></article>
                <article className="panel report-metric"><span className="muted">On track</span><strong>{records.filter((record) => record.status === "On track").length}</strong></article>
                <article className="panel report-metric"><span className="muted">Average progress</span><strong>{records.length ? Math.round(records.reduce((sum, record) => sum + record.progress, 0) / records.length) : 0}%</strong></article>
              </div>
              <div className="grid grid-2 content-grid report-content">
                <TrendChart period={period} />
                <section className="panel report-export">
                  <h2>Initiative report</h2>
                  <p className="muted">Export the records for the selected status filter as a CSV file. Data is illustrative.</p>
                  <RecordFilters query={query} onQueryChange={setQuery} status={status} onStatusChange={setStatus} />
                  <p className="report-count">{filteredRecords.length} matching records will be included.</p>
                  <button className="btn" type="button" onClick={exportReport}>
                    <Download size={17} aria-hidden="true" /> Download CSV
                  </button>
                </section>
              </div>
              <section className="panel section-panel">
                <div className="section-head">
                  <div><h2>Status breakdown</h2><p className="muted section-subtitle">Initiatives matching the current report filters.</p></div>
                  <span className="pill">{filteredRecords.length} records</span>
                </div>
                <RecordTable records={filteredRecords} />
              </section>
            </>
          )}

          {activeView === "Settings" && (
            <form className="panel settings-panel" onSubmit={saveSettings}>
              <h2>Workspace preferences</h2>
              <p className="muted settings-intro">Changes apply to this demo workspace for the current browser session. No real notifications are sent.</p>
              <label className="field settings-name">
                <span>Workspace name</span>
                <input required maxLength={50} value={preferences.workspaceName} onChange={(event) => updatePreference("workspaceName", event.target.value)} />
              </label>
              <div className="preference-list">
                <label className="preference-option">
                  <input type="checkbox" checked={preferences.weeklySummary} onChange={(event) => updatePreference("weeklySummary", event.target.checked)} />
                  <span><strong>Weekly summary</strong><small>Include a weekly summary in this demo workspace.</small></span>
                </label>
                <label className="preference-option">
                  <input type="checkbox" checked={preferences.priorityAlerts} onChange={(event) => updatePreference("priorityAlerts", event.target.checked)} />
                  <span><strong>Priority alerts</strong><small>Highlight initiatives marked at risk or delayed.</small></span>
                </label>
              </div>
              <div className="settings-actions">
                <button className="btn" type="submit">Save settings</button>
                {settingsMessage && <span className="success settings-success" role="status">{settingsMessage}</span>}
              </div>
            </form>
          )}
        </main>
      </div>

      <footer>{preferences.workspaceName} Frontend Development Internship · Operations dashboard · Mock data only</footer>
    </div>
  );
}

export default App;
