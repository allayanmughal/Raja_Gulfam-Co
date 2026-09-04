export type EventTemplateType = 
  | 'template1' 
  | 'template2' 
  | 'template3' 
  | 'template4' 
  | 'template5' 
  | 'template6';

export interface EventItem {
  id: string;
  title: string;
  priorityDetail: string; // High-priority detail displayed in RED
  description: string;
  images: string[];
  date: string;
  template: EventTemplateType;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  title: string;
  priorityDetail: string;
  description: string;
  images: string[];
  date: string;
  template: EventTemplateType;
  published: boolean;
}

export interface TemplateDefinition {
  id: EventTemplateType;
  name: string;
  subtitle: string;
  description: string;
}
