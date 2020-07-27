export interface UseRequestAttrs<D> {
  url: string;
  method: string;
  body?: Record<string, any>;
  headers?: Record<string, any>;
  onSuccess: (data: D) => void;
  onError?: (err: Error) => void;
}

export interface DoRequestAttrs {
  uri?: string;
  formData?: FormData;
  body?: any;
  // Allows any
  [key: string]: any;
}
