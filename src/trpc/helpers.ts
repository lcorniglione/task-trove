import { AppRouter } from "@/server/api/root";
import { TRPCClientError } from "@trpc/client";

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
