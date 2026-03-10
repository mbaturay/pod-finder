import type { Pod, PodId, GrowthFocusArea } from '../types';

export const PODS: Record<PodId, Pod> = {
  pod1: {
    id: 'pod1',
    areaLabel: 'Area 1',
    areaName: 'Grow Our Craft',
    areaDescription: 'Teaching, coaching, internal learning sessions, and creating learning materials.',
    podName: 'Training Programs',
    podDescription: 'Build internal capability through training, mentoring, and skill development',
    detailedQuestions: [
      'I enjoy teaching or coaching others.',
      "I'm comfortable facilitating internal learning sessions.",
      'I like creating reusable learning materials (guides, exercises, examples).',
      'I enjoy exploring new tools or methods and sharing what works.',
    ],
  },
  pod2: {
    id: 'pod2',
    areaLabel: 'Area 2',
    areaName: 'Shape Our Client Stories',
    areaDescription: 'Research, narratives, and client-facing materials for pursuits and go-to-market sales support',
    podName: 'Pursuit / Sales GTM Support',
    podDescription: 'Support sales and business development with thought leadership and pursuit materials',
    detailedQuestions: [
      'I like turning messy information into a clear, compelling point of view.',
      'I enjoy doing market or industry research to support client conversations.',
      "I'm comfortable creating pitch-ready materials (slides, narratives, one-pagers).",
      'I enjoy running future-state or "art of the possible" sessions.',
    ],
  },
  pod3: {
    id: 'pod3',
    areaLabel: 'Area 3',
    areaName: 'Strengthen Our Team',
    areaDescription: 'Community building and team connection',
    podName: 'Culture & Community of Practice',
    podDescription: 'Foster team culture, community, and create opportunities for connection',
    detailedQuestions: [
      'I enjoy building community and connecting people.',
      'I like organizing knowledge-sharing or team learning sessions.',
      'I care about psychological safety and want to help strengthen it.',
      "I'm happy to organize social or volunteer initiatives.",
    ],
  },
  pod4: {
    id: 'pod4',
    areaLabel: 'Area 4',
    areaName: 'Scale Delivery Excellence',
    areaDescription: 'Templates, standards, and process improvements',
    podName: 'Delivery Support & Enablement',
    podDescription: 'Create tools, templates, and standards to improve delivery excellence',
    detailedQuestions: [
      'I like creating repeatable workshop templates or playbooks.',
      'I enjoy building research toolkits (interview guides, synthesis templates).',
      "I'm interested in defining or maintaining quality standards for deliverables.",
      'I like improving how we run projects (kickoffs, estimation, retrospectives).',
    ],
  },
};

export const POD_IDS: PodId[] = ['pod1', 'pod2', 'pod3', 'pod4'];

export const GROWTH_FOCUS_OPTIONS: GrowthFocusArea[] = [
  'Technical Depth',
  'Leadership Skills',
  'Cross-Functional Exposure',
  'Client-Facing Skills',
  'Mentoring & Coaching',
  'Process Improvement',
  'Innovation & Experimentation',
  'Community Building',
];

/** Maps each growth focus area to the pod areas it supports. */
export const GROWTH_AREA_MAPPING: Record<GrowthFocusArea, PodId[]> = {
  'Technical Depth': ['pod1', 'pod4'],
  'Leadership Skills': ['pod1', 'pod3'],
  'Cross-Functional Exposure': ['pod2', 'pod4'],
  'Client-Facing Skills': ['pod2'],
  'Mentoring & Coaching': ['pod1', 'pod3'],
  'Process Improvement': ['pod4'],
  'Innovation & Experimentation': ['pod1', 'pod4'],
  'Community Building': ['pod3'],
};
