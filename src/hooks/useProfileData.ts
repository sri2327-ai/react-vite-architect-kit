
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface UserProfile {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  specialty: string;
  ehrMode: boolean;
  ehrName?: string;
  notesRetentionDuration: number;
}

export const useProfileData = (useApi: boolean = false) => {
  const [profile, setProfile] = useState<UserProfile>({
    email: 'doctor@example.com',
    phoneNumber: '+1 (555) 123-4567',
    firstName: 'Dr. John',
    lastName: 'Smith',
    specialty: 'Cardiology',
    ehrMode: true,
    ehrName: 'Epic',
    notesRetentionDuration: 12
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (useApi) {
      fetchProfileData();
    }
  }, [useApi]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.get<UserProfile>('/user/profile');
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile data');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (useApi) {
      try {
        setLoading(true);
        const updatedProfile = await apiService.put<UserProfile>('/user/profile', updates);
        setProfile(updatedProfile);
        return updatedProfile;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update profile');
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      return updatedProfile;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfileData
  };
};
