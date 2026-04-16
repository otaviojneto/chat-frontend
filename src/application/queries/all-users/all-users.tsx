import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/application/queries/keys';
import { userService } from '@/application/services/users/users';

export const useGetUsers = () => {
    return useQuery({
        queryKey: queryKeys.users,
        queryFn: () => userService.getUsers(),
    });
};