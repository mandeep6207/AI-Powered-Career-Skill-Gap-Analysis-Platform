import { useState, useCallback } from 'react';
import api from '../services/api';

export const useAssessmentAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = useCallback(async (targetRole, skills, proficiency, weeklyHours) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/analyze', {
        target_role: targetRole,
        current_skills: skills,
        proficiency,
        weekly_hours: weeklyHours
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyze, loading, error };
};

export const useHistoryAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/history');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load history');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchHistory, loading, error };
};

export const useProfileAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchProfile, loading, error };
};
