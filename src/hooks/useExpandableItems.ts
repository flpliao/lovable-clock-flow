import { useCallback, useState } from 'react';

interface UseExpandableItemsOptions<T extends string | number> {
  defaultExpanded?: T[];
  singleExpand?: boolean;
}

export const useExpandableItems = <T extends string | number>({
  defaultExpanded = [],
  singleExpand = false,
}: UseExpandableItemsOptions<T> = {}) => {
  const [expandedItems, setExpandedItems] = useState<Set<T>>(new Set(defaultExpanded));

  // 切換單個項目的展開狀態
  const toggleItem = useCallback(
    (id: T) => {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          if (singleExpand) {
            newSet.clear();
          }
          newSet.add(id);
        }
        return newSet;
      });
    },
    [singleExpand]
  );

  // 檢查項目是否已展開
  const isExpanded = useCallback(
    (id: T) => {
      return expandedItems.has(id);
    },
    [expandedItems]
  );

  // 展開所有項目
  const expandAll = useCallback(
    (allIds: T[]) => {
      if (singleExpand && allIds.length > 0) {
        setExpandedItems(new Set([allIds[0]]));
      } else {
        setExpandedItems(new Set(allIds));
      }
    },
    [singleExpand]
  );

  // 收合所有項目
  const collapseAll = useCallback(() => {
    setExpandedItems(new Set());
  }, []);

  // 檢查是否全部展開
  const isAllExpanded = useCallback(
    (allIds: T[]) => {
      return allIds.length > 0 && allIds.every(id => expandedItems.has(id));
    },
    [expandedItems]
  );

  // 獲取展開的項目數量
  const expandedCount = expandedItems.size;

  return {
    expandedItems,
    toggleItem,
    isExpanded,
    expandAll,
    collapseAll,
    isAllExpanded,
    expandedCount,
  };
};
