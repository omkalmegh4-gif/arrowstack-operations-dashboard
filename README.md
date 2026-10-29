# Operations Dashboard UI

A React + TypeScript frontend project created for the Arrowstack Frontend Development Internship assignment.

## Objective
Give an operations stakeholder a quick view of illustrative KPIs, trends, alerts, and filterable operational records.

## Features
- KPI summary cards
- Trend chart from clearly labelled mock data
- Searchable and filterable initiative tracker with an add-initiative form
- Team summaries derived from the initiative records, with links to team initiatives
- Reports view with status filters and CSV export
- Settings view for the demo workspace name and session-only notification preferences
- Status alerts and attention indicators
- Empty search state
- Responsive, keyboard-operable workspace navigation

## Tech stack
- React + TypeScript
- Vite development/build tooling
- CSS responsive layout
- Vitest + React Testing Library for automated tests

## Prerequisites
- Node.js 22.12+ recommended for this setup
- npm
- Git (for version control)

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

## Validate
```bash
npm test
npm run build
```
Record the actual output and any issues in `docs/TESTING.md`. Do not claim a test passed unless you ran it.

## Project limitations
- This is a frontend demonstration using local state and/or clearly identified mock data.
- Initiative changes and workspace preferences are held in React state for the current browser session only; they are not persisted to a server.
- No real payment processing, production API, user account backend, or server persistence is configured.
- Browser local storage (where used) is only for this demo; it is not a secure or shared database.

## Evidence to capture
- Desktop screenshot
- Mobile-width screenshot
- Main workflow video/GIF
- Test command output
- Accessibility keyboard-navigation notes
- Known bugs and limitations

## Submission
Push this folder to its own GitHub repository. See `docs/SUBMISSION.md`.
