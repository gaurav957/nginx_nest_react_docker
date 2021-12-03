export type qType = 's' | 'm' | 'g' | 'gm';

const filterTemplate = [
  {
    label: 'QText', // QText field,
    question: 'QID', // Question id reference
  },
];

type Question = {
  qId: string;
  labelText: string;
  questionText: string;
  type: qType;
  options?: {
    labelText: string;
    labelCode: string;
  }[];
  subGroups?: Question[];
  scale?: {
    labelText: string;
    labelCode: string;
  }[];
};

// Examples for single select question D1

const d1: Question = {
  qId: 'D1',
  questionText: "What is your company's annual revenue?",
  labelText: 'Anual Revenue',
  type: 's',
  options: [
    {
      labelText: 'Less than $500M',
      labelCode: '1',
    },
    {
      labelText: '$500M to $1B',
      labelCode: '2',
    },
    {
      labelText: 'Between $1B and $5B',
      labelCode: '3',
    },
    {
      labelText: 'Between $5B and $10B',
      labelCode: '4',
    },
    {
      labelText: 'Between $10B and $50B',
      labelCode: '5',
    },
    {
      labelText: 'Greater than $50B',
      labelCode: '6',
    },
  ],
};

// example for single select Grid

const q7: Question = {
  qId: 'Q7',
  labelText: 'Stage of overall adoption of emerging technologies',
  questionText:
    'What is the stage of overall adoption of emerging technologies in your company?',
  type: 'g',
  options: null,
  subGroups: [
    {
      qId: 'Q7_1',
      questionText: '',
      labelText: 'Process automation',
      type: 's',
    },
    {
      qId: 'Q7_2',
      questionText: '',
      labelText: 'Process mining and discovery',
      type: 's',
    },
    {
      qId: 'Q7_3',
      questionText: '',
      labelText: 'Artificial intelligence (AI)',
      type: 's',
    },
    {
      qId: 'Q7_4',
      questionText: '',
      labelText: 'Hybrid-cloud or multi-cloud',
      type: 's',
    },
    {
      qId: 'Q7_5',
      questionText: '',
      labelText: 'Blockchain',
      type: 's',
    },
    {
      qId: 'Q7_6',
      questionText: '',
      labelText: 'Cybersecurity',
      type: 's',
    },
    {
      qId: 'Q7_7',
      questionText: '',
      labelText: 'Augmented or virtual reality',
      type: 's',
    },
    {
      qId: 'Q7_8',
      questionText: '',
      labelText: 'Internet of things (IoT)',
      type: 's',
    },
    {
      qId: 'Q7_9',
      questionText: '',
      labelText: 'Smart analytics (predictive and prescriptive analytics)',
      type: 's',
    },
    {
      qId: 'Q7_10',
      questionText: '',
      labelText: '5G',
      type: 's',
    },
    {
      qId: 'Q7_11',
      questionText: '',
      labelText: 'Quantum computing',
      type: 's',
    },
  ],
  scale: [
    {
      labelText: 'No plans to invest',
      labelCode: '1',
    },
    {
      labelText: 'Planning to invest in future',
      labelCode: '2',
    },
    {
      labelText: 'Piloting',
      labelCode: '3',
    },
    {
      labelText: 'Currently implementing in a few areas',
      labelCode: '1',
    },
    {
      labelText: 'No plans to invest',
      labelCode: '1',
    },
  ],
};

type SurveyData = {
  gId: string;
  qId: string;
  responses: {
    respId: string;
    wave: number;
    value: string[];
  }[];
};

type SurveyData2 = {
  respId: string;
  questions: [
    {
      wave: number;
      gId: string;
      qId: string;
      value: string[];
    },
  ];
};
