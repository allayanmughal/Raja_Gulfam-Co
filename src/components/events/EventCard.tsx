import React from 'react';
import type { EventItem } from '../../types/event';
import { Template1Feature } from './templates/Template1Feature';
import { Template2Split } from './templates/Template2Split';
import { Template3Magazine } from './templates/Template3Magazine';
import { Template4Minimal } from './templates/Template4Minimal';
import { Template5Overlay } from './templates/Template5Overlay';
import { Template6Asymmetric } from './templates/Template6Asymmetric';

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  switch (event.template) {
    case 'template1':
      return <Template1Feature event={event} />;
    case 'template2':
      return <Template2Split event={event} />;
    case 'template3':
      return <Template3Magazine event={event} />;
    case 'template4':
      return <Template4Minimal event={event} />;
    case 'template5':
      return <Template5Overlay event={event} />;
    case 'template6':
      return <Template6Asymmetric event={event} />;
    default:
      return <Template1Feature event={event} />;
  }
};
