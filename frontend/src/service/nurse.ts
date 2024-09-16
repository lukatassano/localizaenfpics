import { AxiosResponse } from 'axios';
import { api } from '../api/api';
import { FormType } from '../types/form';

export function saveNurse(nurse: FormType): Promise<AxiosResponse<FormType | null>> {
  return api.post("/nurse/", nurse);
}
