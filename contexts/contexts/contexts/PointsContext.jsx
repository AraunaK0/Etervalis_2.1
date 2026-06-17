import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../services/supabaseClient';

const PointsContext = createContext();

export function usePoints() {
  return useContext(PointsContext);
}

export function PointsProvider({ children }) {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPoints();
      subscribeToPoints();
    }
  }, [user]);

  const loadPoints = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('pontos')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setPoints(data.pontos || 0);
    } catch (error) {
      console.error('Erro ao carregar pontos:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPoints = () => {
    const subscription = supabase
      .channel('points_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'usuarios',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          setPoints(payload.new.pontos);
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  };

  const addPoints = async (gameId, pointsToAdd, details = {}) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('adicionar_pontos', {
        p_usuario_id: user.id,
        p_jogo_id: gameId,
        p_pontos: pointsToAdd,
        p_detalhes: details,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error);
      return false;
    }
  };

  return (
    <PointsContext.Provider value={{ points, loading, addPoints, loadPoints }}>
      {children}
    </PointsContext.Provider>
  );
}