import { useContext } from 'react';
import { PointsContext } from '../contexts/PointsContext';

export function usePoints() {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
}