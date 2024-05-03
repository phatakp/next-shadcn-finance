import { getGroups } from "@/lib/db/queries/groups.queries";
import { useQuery } from "@tanstack/react-query";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroups(),
  });
}
