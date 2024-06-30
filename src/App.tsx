
import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/ui/LoadingSpinner";

const UserProfileList = React.lazy(() => import('./components/UserProfileList/UserProfileList'));
const DataTable = React.lazy(() => import('./components/DataTable/DataTable'));

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<UserProfileList />} />
              <Route path="/datatable" element={<DataTable />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </>
  );
};

export default App;
