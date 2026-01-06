import type { Signal } from '../types';

/**
 * Convert API signal data to frontend Signal type
 * Handles date conversion and ensures proper typing
 */
export const convertApiTicket = (apiSignal: any): any => ({
  ...apiSignal,
  createdAt: new Date(apiSignal.createdAt),
  updatedAt: new Date(apiSignal.updatedAt),
  comments: apiSignal.comments?.map((comment: any) => ({
    ...comment,
    createdAt: new Date(comment.createdAt)
  })) || [],
  internalNotes: apiSignal.internalNotes?.map((note: any) => ({
    ...note,
    createdAt: new Date(note.createdAt)
  })) || []
});

/**
 * Convert array of API signals
 */
export const convertApiTickets = (apiSignals: any[]): any[] => {
  return apiSignals.map(convertApiTicket);
};