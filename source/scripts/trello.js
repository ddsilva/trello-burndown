((Burndown) => {
  let lists, cards;
  const LISTS = {
    'objetivos': {
      id: '58ca9c4ed8255d0e5f03348d',
      exclude: true,
    },
    'settings': {
      id: '58d15dd35ac5805797651428',
      exclude: true
    },
    'done': {
      id: '58c824d4ec8df6381b092df0'
    }
  };

  const getLists = () => Trello.get('/board/58c824490fc0684259d9f180/lists', {
    cards: 'open'
  });

  const getComments = () => Trello.get(`/list/${LISTS.settings.id}/actions`, {
    filter: 'commentCard'
  });

  const filterLists = lists => {
    return lists.filter(item => {
      let valid = true;

      Object.keys(LISTS).forEach((value) => {
        let object = LISTS[value];

        if (object.exclude && object.id === item.id) {
          valid = false
        }
      });

      return valid
    });
  };

  const init = () => {
    $.when(getLists(), getComments()).done( (lists, comments) => {
      lists = lists[0];

      const options = {
        sprintStartDay: lists.find(item => item.id == LISTS.settings.id).cards[0].due,
      };

      lists = filterLists(lists);

      Object.assign(options, {
        sprintDays: comments[0][0].data.text,
        initialSprintTaks: lists.reduce((prev, curr) => {
          return prev + curr.cards.length
        }, 0)
      });

      return new Burndown(options);
    });
  };

  Trello.authorize({
    type: 'popup',
    name: 'Getting Started Application',
    scope: { read: 'true' },
    expiration: 'never',
    success: init,
    error: () => console.log('Failed authentication')
  });
})(Burndown);