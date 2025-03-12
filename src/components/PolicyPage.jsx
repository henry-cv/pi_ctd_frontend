import NavDash from './NavDash';
import AsidePayments from "./AsidePayments";
import DashPolicies from './DashPolicies';
const PolicyPage = () => {
  return (
    <div className='page-policies-container'>
      <NavDash variant="home" />
      <main>
        <AsidePayments />
        <DashPolicies />
      </main>
    </div>
  )
}

export default PolicyPage