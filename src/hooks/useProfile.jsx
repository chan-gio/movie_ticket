import { useQuery, useQueryClient } from '@tanstack/react-query';
import UserService from '../services/UserService';

const formatUserData = (userResponse) => {
  const [firstName, ...lastNameParts] = (userResponse.full_name || '').trim().split(/\s+/);
  return {
    firstName: firstName || '',
    lastName: lastNameParts.join(' ') || '',
    email: userResponse.email || '',
    phone: userResponse.phone || '',
    profile_picture_url: userResponse.profile_picture_url || '',
  };
};

export const useUserData = (userId) => {
  return useQuery({
    queryKey: ['userData', userId],
    queryFn: async () => {
      const response = await UserService.getUserById(userId);
      return formatUserData(response);
    },
    enabled: !!userId, // Only fetch if userId exists
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Hook to invalidate user data after profile update
export const useInvalidateUserData = () => {
  const queryClient = useQueryClient();
  return (userId) => queryClient.invalidateQueries(['userData', userId]);
};