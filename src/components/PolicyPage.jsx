import NavDash from './NavDash';
import AsidePayments from "./AsidePayments";
import DashPolicies from './DashPolicies';
import Footer from "./Footer";
const PolicyPage = () => {
  return (
    <div className='page-policies-container'>
      <NavDash variant="home" />
      <main className="main-policies">
        <AsidePayments />
        <DashPolicies />
      </main>
      <Footer />
    </div>
  )
}

export default PolicyPage