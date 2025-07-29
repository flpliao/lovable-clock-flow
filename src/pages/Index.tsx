import FeatureCards from '@/components/FeatureCards';
import LocationCheckIn from '@/components/LocationCheckIn';
import WelcomeSection from '@/components/WelcomeSection';
import { useAnnualLeaveBalance } from '@/hooks/useStores';
import useEmployeeStore from '@/stores/employeeStore';

const Index = () => {
  const employee = useEmployeeStore(state => state.employee);
  const annualLeaveBalance = useAnnualLeaveBalance();

  const leaveHours = annualLeaveBalance
    ? (annualLeaveBalance.total_days - annualLeaveBalance.used_days) * 8
    : 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen flex justify-center">
      {/* 背景層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>

      {/* 漂浮光點 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div
        className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse"
        style={{
          animationDelay: '2s',
        }}
      ></div>
      <div
        className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse"
        style={{
          animationDelay: '4s',
        }}
      ></div>
      <div
        className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse"
        style={{
          animationDelay: '6s',
        }}
      ></div>

      <div className="relative z-10 w-full min-h-screen pb-safe md:pt-12 py-0">
        {/* 歡迎區塊 */}
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <WelcomeSection userName={employee.name} />
        </div>

        {/* 打卡區塊（壓縮下邊距） */}
        <div className="w-full sm:px-6 lg:px-8 max-w-7xl mx-auto mb-[-8px] sm:mb-0 py-[10px] px-[15px]">
          <LocationCheckIn />
        </div>

        {/* 功能卡片（完全貼上打卡區） */}
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-0">
          <FeatureCards annualLeaveBalance={leaveHours} />
        </div>
      </div>
    </div>
  );
};

export default Index;
