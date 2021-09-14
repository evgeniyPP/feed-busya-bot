export default {
  name: 'feed',
  title: 'Когда кормили?',
  type: 'document',
  fields: [
    {
      name: 'who',
      title: 'Кто',
      type: 'string',
    },
    {
      name: 'when',
      title: 'Когда',
      type: 'datetime',
    },
    {
      name: 'what',
      title: 'Чем',
      type: 'string',
    },
  ],

  preview: {
    select: {
      title: 'when',
    },
  },
};
