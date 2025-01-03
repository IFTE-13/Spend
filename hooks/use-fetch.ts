import { useState } from "react";
import { toast } from "sonner";

// Define the hook's return type for better type inference
type UseFetchResult<TData, TArgs extends any[]> = {
  data: TData | undefined;
  loading: boolean;
  error: Error | null;
  fn: (...args: TArgs) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<TData | undefined>>;
};

// Generic type parameters for the callback and its arguments
const useFetch = <TData, TArgs extends any[]>(
  cb: (...args: TArgs) => Promise<TData>
): UseFetchResult<TData, TArgs> => {
  const [data, setData] = useState<TData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: TArgs) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;