import React from 'react';
import type { EventItem } from '../../types/event';
import { GenericEventCard } from './GenericEventCard';

interface EventCardProps {
  event: EventItem;
}

/**
 * Single generic card layout for every announcement: image on the left,
 * description on the right, full details in an expanded modal on click.
 */
export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return <GenericEventCard event={event} />;
};
