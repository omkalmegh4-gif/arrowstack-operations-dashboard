import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Operations Dashboard UI", () => {
  it("labels the data as a demo and shows KPI cards", () => {
    render(<App />);
    expect(screen.getByText(/all figures and records below are mock data/i)).toBeInTheDocument();
    expect(screen.getByText("Operational score")).toBeInTheDocument();
  });
  it("filters records by status", () => {
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
});
