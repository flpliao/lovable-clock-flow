import LazyLoadingSpinner from '@/components/ui/LazyLoadingSpinner';
import { lazy, Suspense } from 'react';

/**
 * 載入組件並自動包裹 Suspense
 * @param {Function} importFunc - import 函數
 * @returns React 組件
 */
const LazyWithSuspense = importFunc => {
  const LazyComponent = lazy(importFunc);

  const WrappedComponent = props => {
    return (
      <Suspense fallback={<LazyLoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };

  return WrappedComponent;
};

export default LazyWithSuspense;
