import { createBcmsMostServerRoutes } from '@becomes/cms-most';
import {
  homeApi,
  programmaticApi,
} from './api';

export default createBcmsMostServerRoutes({
  ...homeApi,
  ...programmaticApi,
});
