import core from '@actions/core';
import {NextCall} from './definitions.js';

export function failSafeMiddleware(next: NextCall) {
  return () => {
    try {
      next();
    } catch (e) {
      core.setFailed(String(e));
    }
  };
}
