import type { AIEvent } from '../types';
import { eventDescription, eventPageUrl, sortFeaturedFirst } from './events';

// schema.org JSON-LD built only from fields in events.json: no invented organizers, prices, venues or images.

const ATTENDANCE_MODE: Record<AIEvent['mode'], string> = {
  'in-person': 'https://schema.org/OfflineEventAttendanceMode',
  online: 'https://schema.org/OnlineEventAttendanceMode',
  hybrid: 'https://schema.org/MixedEventAttendanceMode',
};

function place(event: AIEvent) {
  return {
    '@type': 'Place',
    name: `${event.city}, ${event.country}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: event.city,
      addressCountry: event.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: event.lat,
      longitude: event.lng,
    },
  };
}

function virtualLocation(event: AIEvent) {
  return { '@type': 'VirtualLocation', url: event.url };
}

function eventLocation(event: AIEvent) {
  if (event.mode === 'online') return virtualLocation(event);
  if (event.mode === 'hybrid') return [place(event), virtualLocation(event)];
  return place(event);
}

/** Event object without @context, so it can be embedded in an ItemList */
function eventNode(event: AIEvent, lang: string) {
  const description = eventDescription(event, lang);
  return {
    '@type': 'Event',
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: ATTENDANCE_MODE[event.mode],
    location: eventLocation(event),
    url: event.url,
    ...(description && { description }),
  };
}

export function eventSchema(event: AIEvent, lang: string) {
  return { '@context': 'https://schema.org', ...eventNode(event, lang) };
}

/** Upcoming events for a language home page, featured first */
export function eventListSchema(events: AIEvent[], lang: string, listUrl: string) {
  const sorted = sortFeaturedFirst(events);
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Upcoming AI events',
    url: listUrl,
    numberOfItems: sorted.length,
    itemListElement: sorted.map((event, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: eventPageUrl(event, lang),
      item: eventNode(event, lang),
    })),
  };
}
