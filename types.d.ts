import { Router, RouteLocationNormalized } from "vue-router";

export {};

declare global {
  interface IBaseResponseModel<T> {
    data?: {
      code: number;
      status: string;
      payload?: {
        list: T;
        total: number
      }
    }
  }
}

