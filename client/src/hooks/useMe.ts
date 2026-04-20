import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

export type Me = {
  email: string;
  username: string;
};

export const useMe = () =>
  useQuery<Me>({
    queryKey: ["me"],
    queryFn: () => axiosInstance.get<Me>("/auth/me").then((r) => r.data),
    retry: false,
  });
