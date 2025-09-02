import FeatureCards from '@/components/FeatureCards';
import LocationCheckIn from '@/components/LocationCheckIn';
import WelcomeSection from '@/components/WelcomeSection';
import PageLayout from '@/components/layouts/PageLayout';
import useEmployeeStore from '@/stores/employeeStore';

const Index = () => {
  const employee = useEmployeeStore(state => state.employee);

  return (
    <PageLayout className="pb-safe py-0">
      <WelcomeSection userName={employee.name} />
      <LocationCheckIn />
      <FeatureCards />
    </PageLayout>
  );
};

export default Index;
