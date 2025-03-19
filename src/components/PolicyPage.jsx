import "../css/global/variables.css";
import "../css/pages/PolicyPage.css";
import NavDash from './NavDash';
import AsidePayments from "./AsidePayments";
import DashPolicies from './DashPolicies';
import Footer from "./Footer";
import { useState } from "react";
import { useEffect, useRef } from 'react';
import { useContextGlobal } from "../gContext/globalContext";

const PolicyPage = () => {
  const [selectedPolicy, setSelectedPolicy] = useState("pagos");
  const rootRef = useRef(null);
  const { state } = useContextGlobal();
  const { theme } = state;

  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  return (
    <div className={`page-policies-container ${theme}`} ref={rootRef}>
      <NavDash variant="home" />
      <main className={`main-policies ${theme}`}>
        <AsidePayments setSelectedPolicy={setSelectedPolicy} />
        <DashPolicies selectedPolicy={selectedPolicy} setSelectedPolicy={setSelectedPolicy} />
      </main>
      <Footer />
    </div>
  )
}

export default PolicyPage
