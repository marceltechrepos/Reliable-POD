import OnboardingCard from '../components/Dashboard/OnboardingCard'
import OrdersChart from '../components/Dashboard/OrdersChart'
import RecentOrders from '../components/Dashboard/RecentOrders'
import PaymentAlert from '../components/Dashboard/PaymentAlert'
import StatsCard from '../components/Dashboard/StatsCard'
import QuickActions from '../components/Dashboard/QuickActions'
import { DollarSign } from "lucide-react";
function UserDashboard() {
  return (
    <>
      <OnboardingCard />
      <StatsCard
        title="Users"
        value="1,245"
        change="+12%"
        trend="up"
        icon={DollarSign}
      />
      <OrdersChart />
      <RecentOrders />
      <PaymentAlert />
      <QuickActions />

    </>
  )
}

export default UserDashboard