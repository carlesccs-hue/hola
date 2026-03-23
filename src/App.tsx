/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import WorkoutSession from "./components/WorkoutSession";
import NearbyParks from "./components/NearbyParks";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="workout/:id" element={<WorkoutSession />} />
          <Route path="parks" element={<NearbyParks />} />
        </Route>
      </Routes>
    </Router>
  );
}
