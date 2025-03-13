import "../css/global/variables.css";
import NavDash from './NavDash';
import AsidePayments from "./AsidePayments";
import DashPolicies from './DashPolicies';
import Footer from "./Footer";
import { useState } from "react";

const PolicyPage = () => {
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  return (
    <div className='page-policies-container'>
      <NavDash variant="home" />
      <main className="main-policies">
        <AsidePayments setSelectedPolicy={setSelectedPolicy} />
        <DashPolicies selectedPolicy={selectedPolicy} setSelectedPolicy={setSelectedPolicy} />
      </main>
      <Footer />
    </div>
  )
}

export default PolicyPage