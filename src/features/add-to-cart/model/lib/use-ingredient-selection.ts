'use client';

import { useCallback, useState } from 'react';

export function useIngredientSelection(inCartIds: Set<string>) {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode((current) => {
      if (current) {
        setSelectedIds(new Set());
        return false;
      }

      setSelectedIds(new Set(inCartIds));
      return true;
    });
  }, [inCartIds]);

  const toggleLine = useCallback(
    (lineId: string) => {
      if (inCartIds.has(lineId)) {
        return;
      }

      setSelectedIds((current) => {
        const next = new Set(current);
        if (next.has(lineId)) {
          next.delete(lineId);
        } else {
          next.add(lineId);
        }
        return next;
      });
    },
    [inCartIds],
  );

  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

  const isLineSelected = useCallback(
    (lineId: string) => inCartIds.has(lineId) || selectedIds.has(lineId),
    [inCartIds, selectedIds],
  );

  return {
    isSelectionMode,
    selectedIds,
    selectedCount: isSelectionMode
      ? [...selectedIds].filter((id) => !inCartIds.has(id)).length
      : 0,
    toggleSelectionMode,
    toggleLine,
    exitSelectionMode,
    isLineSelected,
  };
}
