export interface IRefresh {
  pourcentage: number;
}

export type RefreshEvent = 'focus' | 'focusin' | 'blur' | 'focusout' | 'visibilitychange' | 'visibilitychangeState' | 'none';