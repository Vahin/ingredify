'use client';

import { useCallback, useState } from 'react';

export function useIngredientSelection() {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode((current) => {
      if (current) {
        setSelectedIds(new Set());
      }
      return !current;
    });
  }, []);

  const toggleLine = useCallback((lineId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(lineId)) {
        next.delete(lineId);
      } else {
        next.add(lineId);
      }
      return next;
    });
  }, []);

  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

  return {
    isSelectionMode,
    selectedIds,
    selectedCount: selectedIds.size,
    toggleSelectionMode,
    toggleLine,
    exitSelectionMode,
  };
}
