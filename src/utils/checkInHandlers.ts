
import { CheckInRecord } from '@/types';
import { getCurrentPosition, calculateDistance, COMPANY_LOCATION, ALLOWED_DISTANCE } from './geolocation';
import { getUserIP } from './networkUtils';
import { validateCheckInLocation, getDepartmentForCheckIn } from './departmentCheckInUtils';
import { Department } from '@/components/departments/types';

// 位置打卡的函數 - 支援部門GPS驗證
export const handleLocationCheckIn = async (
  userId: string,
  actionType: 'check-in' | 'check-out',
  onSuccess: (record: CheckInRecord) => void,
  onError: (error: string) => void,
  setDistance?: (distance: number) => void,
  departments?: Department[],
  employeeDepartment?: string
) => {
  try {
    const position = await getCurrentPosition();
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;
    
    let distance: number;
    let locationName: string;
    let isValidLocation = false;
    let departmentGPS: { lat: number; lng: number } | null = null;
    let gpsComparisonResult: any = {};
    
    // 檢查是否為管理員（簡單的開發模式檢查）
    const isAdmin = userId === '550e8400-e29b-41d4-a716-446655440001'; // 廖俊雄的ID
    
    console.log('🔍 開始位置打卡驗證:', {
      userId,
      employeeDepartment,
      departments: departments?.length || 0,
      isAdmin
    });
    
    // 優先使用部門GPS驗證
    if (departments && employeeDepartment) {
      console.log('🏢 嘗試使用部門GPS驗證:', { 
        employeeDepartment, 
        departmentCount: departments.length 
      });
      
      const targetDepartment = getDepartmentForCheckIn(departments, employeeDepartment);
      
      if (targetDepartment && targetDepartment.gps_status === 'converted' && targetDepartment.latitude && targetDepartment.longitude) {
        console.log('✅ 找到目標部門GPS座標，進行驗證:', {
          departmentName: targetDepartment.name,
          lat: targetDepartment.latitude,
          lng: targetDepartment.longitude,
          radius: targetDepartment.check_in_radius,
          gpsStatus: targetDepartment.gps_status
        });
        
        const validation = validateCheckInLocation(userLat, userLon, targetDepartment);
        distance = validation.distance;
        locationName = targetDepartment.name;
        isValidLocation = validation.isValid;
        departmentGPS = { lat: targetDepartment.latitude, lng: targetDepartment.longitude };
        
        // 記錄詳細的GPS比對結果
        gpsComparisonResult = {
          comparisonType: 'department_gps',
          departmentName: targetDepartment.name,
          departmentGPS: departmentGPS,
          userGPS: { lat: userLat, lng: userLon },
          distance: distance,
          allowedRadius: targetDepartment.check_in_radius || 100,
          gpsStatus: validation.gpsStatus,
          isValid: validation.isValid,
          message: validation.message,
          timestamp: new Date().toISOString()
        };
        
        console.log('📍 部門GPS驗證結果:', gpsComparisonResult);
      } else {
        console.log('⚠️ 部門GPS座標不可用，改用公司總部位置:', {
          departmentFound: !!targetDepartment,
          gpsStatus: targetDepartment?.gps_status,
          hasCoordinates: !!(targetDepartment?.latitude && targetDepartment?.longitude)
        });
        
        // 如果部門GPS不可用，返回錯誤
        if (targetDepartment) {
          const errorMessage = targetDepartment.gps_status === 'failed' 
            ? `部門「${targetDepartment.name}」GPS轉換失敗，請聯繫管理者重新設定`
            : `部門「${targetDepartment.name}」尚未設定GPS座標，請聯繫管理者設定`;
          onError(errorMessage);
          return;
        } else {
          onError(`找不到部門「${employeeDepartment}」，請聯繫管理者確認部門設定`);
          return;
        }
      }
    } else {
      console.log('📍 使用公司總部位置進行驗證');
      // 使用原有的公司總部位置驗證
      distance = calculateDistance(userLat, userLon, COMPANY_LOCATION.latitude, COMPANY_LOCATION.longitude);
      locationName = COMPANY_LOCATION.name;
      isValidLocation = distance <= ALLOWED_DISTANCE;
      
      // 記錄總公司GPS比對結果
      gpsComparisonResult = {
        comparisonType: 'company_hq',
        departmentName: '總公司',
        departmentGPS: { lat: COMPANY_LOCATION.latitude, lng: COMPANY_LOCATION.longitude },
        userGPS: { lat: userLat, lng: userLon },
        distance: distance,
        allowedRadius: ALLOWED_DISTANCE,
        gpsStatus: 'company_default',
        isValid: isValidLocation,
        message: isValidLocation ? '總公司打卡成功' : '距離總公司太遠',
        timestamp: new Date().toISOString()
      };
    }
    
    if (setDistance) {
      setDistance(distance);
    }
    
    console.log('✅ 位置打卡驗證完成:', {
      userPosition: { lat: userLat, lon: userLon },
      distance,
      locationName,
      isValidLocation,
      isAdmin,
      gpsComparisonResult
    });
    
    // 檢查位置是否有效
    if (!isValidLocation && !isAdmin) {
      onError(gpsComparisonResult.message || `您距離${locationName} ${Math.round(distance)} 公尺，超過允許範圍`);
      return;
    }
    
    // 如果是管理員且超過距離，給予警告但允許打卡
    if (!isValidLocation && isAdmin) {
      console.warn(`🔧 管理員模式：允許遠距離打卡 (${Math.round(distance)} 公尺)`);
    }
    
    const record: CheckInRecord = {
      id: Date.now().toString(),
      userId,
      timestamp: new Date().toISOString(),
      type: 'location',
      status: 'success',
      action: actionType,
      details: {
        latitude: userLat,
        longitude: userLon,
        distance: Math.round(distance),
        locationName,
        departmentLatitude: departmentGPS?.lat,
        departmentLongitude: departmentGPS?.lng,
        departmentName: gpsComparisonResult.departmentName,
        gpsComparisonResult
      }
    };
    
    console.log('📝 產生的打卡記錄:', record);
    onSuccess(record);
  } catch (error) {
    console.error('❌ 位置打卡失敗:', error);
    onError(error instanceof Error ? error.message : '位置打卡失敗');
  }
};

// IP 打卡的函數 - 保持不變
export const handleIpCheckIn = async (
  userId: string,
  actionType: 'check-in' | 'check-out',
  onSuccess: (record: CheckInRecord) => void,
  onError: (error: string) => void
) => {
  try {
    const ip = await getUserIP();
    console.log('取得 IP 位址:', ip);
    
    const record: CheckInRecord = {
      id: Date.now().toString(),
      userId,
      timestamp: new Date().toISOString(),
      type: 'ip',
      status: 'success',
      action: actionType,
      details: {
        ip,
        locationName: 'IP遠端打卡'
      }
    };
    
    console.log('產生的IP打卡記錄:', record);
    onSuccess(record);
  } catch (error) {
    console.error('IP 打卡失敗:', error);
    onError(error instanceof Error ? error.message : 'IP 打卡失敗');
  }
};
