import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserService from '../services/UserService';

// Hook để lấy danh sách users với pagination
export const useUsers = ({ page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['users', page, perPage],
    queryFn: async () => {
      const response = await UserService.getAllUsers(page, perPage);
      return response;
    },
    staleTime: 2 * 60 * 1000, // Dữ liệu được coi là fresh trong 2 phút
    cacheTime: 5 * 60 * 1000, // Cache được giữ trong 5 phút
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

// Hook để tìm kiếm users
export const useSearchUsers = ({ keyword, page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['searchUsers', keyword, page, perPage],
    queryFn: async () => {
      const response = await UserService.searchUser(keyword, page, perPage);
      return response;
    },
    enabled: !!keyword, // Chỉ gọi khi có keyword
    staleTime: 1 * 60 * 1000, // Cache ngắn hơn cho search
    cacheTime: 3 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy user theo ID
export const useUserById = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const user = await UserService.getUserById(userId);
      return user;
    },
    enabled: !!userId, // Chỉ gọi khi có userId
    staleTime: 5 * 60 * 1000, // Cache lâu hơn cho user details
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook để tạo user mới
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await UserService.createUser(userData);
      return response;
    },
    onSuccess: () => {
      // Invalidate và refetch users list
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['searchUsers']);
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};

// Hook để cập nhật user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, userData }) => {
      const response = await UserService.updateUser(userId, userData);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['user', variables.userId], data);
      // Invalidate users list
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['searchUsers']);
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
};

// Hook để xóa user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const response = await UserService.deleteUser(userId);
      return response;
    },
    onSuccess: (_, userId) => {
      // Xóa user khỏi cache
      queryClient.removeQueries(['user', userId]);
      // Invalidate users list
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['searchUsers']);
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });
};

// Hook để đổi mật khẩu
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({ userId, passwordData }) => {
      const response = await UserService.changePassword(userId, passwordData);
      return response;
    },
    onError: (error) => {
      console.error("Error changing password:", error);
    },
  });
};

// Hook để quên mật khẩu
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email) => {
      const response = await UserService.forgotPassword(email);
      return response;
    },
    onError: (error) => {
      console.error("Error processing forgot password:", error);
    },
  });
};

// Hook để refresh users data
export const useRefreshUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ page, perPage, keyword }) => {
      if (keyword) {
        return await UserService.searchUser(keyword, page, perPage);
      } else {
        return await UserService.getAllUsers(page, perPage);
      }
    },
    onSuccess: (data, variables) => {
      if (variables.keyword) {
        queryClient.setQueryData(['searchUsers', variables.keyword, variables.page, variables.perPage], data);
      } else {
        queryClient.setQueryData(['users', variables.page, variables.perPage], data);
      }
      // Invalidate để đảm bảo dữ liệu đồng bộ
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['searchUsers']);
    },
    onError: (error) => {
      console.error("Error refreshing users:", error);
    },
  });
};

// Hook để lấy users với search và pagination
export const useUsersWithSearch = ({ keyword, page = 1, perPage = 10 } = {}) => {
  const usersQuery = useUsers({ page, perPage });
  const searchQuery = useSearchUsers({ keyword, page, perPage });

  // Trả về query phù hợp dựa trên có keyword hay không
  if (keyword) {
    return {
      ...searchQuery,
      data: searchQuery.data,
      isSearching: true,
    };
  }

  return {
    ...usersQuery,
    data: usersQuery.data,
    isSearching: false,
  };
}; 