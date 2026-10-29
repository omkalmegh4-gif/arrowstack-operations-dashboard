import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

vi.mock("recharts", () => ({
  ResponsiveContainer: () => <div data-testid="mock-chart" />,
  AreaChart: () => null,
  Area: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Operations Dashboard UI", () => {
  it("labels the data as a demo and shows KPI cards", () => {
    render(<App />);
    expect(screen.getByText(/all figures and records below are mock data/i)).toBeInTheDocument();
    expect(screen.getByText("Operational score")).toBeInTheDocument();
  });

  it("filters overview records by status", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("combobox", { name: /filter status/i }), { target: { value: "Delayed" } });
    expect(screen.getByText("OPS-106")).toBeInTheDocument();
    expect(screen.queryByText("OPS-104")).not.toBeInTheDocument();
  });

  it("shows an empty state for unmatched search", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("textbox", { name: /search records/i }), { target: { value: "no-such-record" } });
    expect(screen.getByRole("status")).toHaveTextContent(/no records match/i);
  });

  it("provides a reporting period selector", () => {
    render(<App />);
    expect(screen.getByRole("combobox", { name: /reporting period/i })).toBeInTheDocument();
  });

  it("opens the initiatives view and adds a new initiative", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Initiatives" }));
    expect(screen.getByRole("heading", { name: "Initiatives" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /add initiative/i }));
    fireEvent.change(screen.getByLabelText("Initiative / team name"), { target: { value: "Customer research" } });
    fireEvent.change(screen.getByLabelText("Owner"), { target: { value: "J. Lee" } });
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "At risk" } });
    fireEvent.click(screen.getByRole("button", { name: "Create initiative" }));

    expect(screen.getByText("OPS-110")).toBeInTheDocument();
    expect(screen.getByText("Customer research")).toBeInTheDocument();
    expect(screen.getByText("J. Lee")).toBeInTheDocument();
    expect(screen.getByText("7 of 7 initiatives")).toBeInTheDocument();
  });

  it("opens Teams and filters initiatives to the selected team", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Teams" }));
    expect(screen.getByRole("heading", { name: "Teams" })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: "View initiatives" })[1]);

    expect(screen.getByRole("heading", { name: "Initiatives" })).toBeInTheDocument();
    expect(screen.getByText("OPS-105")).toBeInTheDocument();
    expect(screen.getByText("OPS-109")).toBeInTheDocument();
    expect(screen.queryByText("OPS-104")).not.toBeInTheDocument();
  });

  it("exports the filtered report as CSV", () => {
    const createObjectURL = vi.fn(() => "blob:report");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Reports" }));
    expect(screen.getByRole("heading", { name: "Reports" })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: /filter status/i }), { target: { value: "Delayed" } });
    fireEvent.click(screen.getByRole("button", { name: /download csv/i }));

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:report");
    expect(screen.getByText("1 matching records will be included.")).toBeInTheDocument();
  });

  it("saves workspace settings and updates the workspace name", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    fireEvent.change(screen.getByLabelText("Workspace name"), { target: { value: "Northstar" } });
    fireEvent.click(screen.getByRole("button", { name: "Save settings" }));

    expect(screen.getByRole("status")).toHaveTextContent("Settings saved for this browser session.");
    expect(screen.getAllByText(/Northstar/).length).toBeGreaterThan(0);
  });
});
