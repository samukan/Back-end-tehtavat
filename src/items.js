// Dummy mock data
const items = [
  {id: 1, name: 'Item1'},
  {id: 2, name: 'Item2'},
  {id: 5, name: 'Item5'},
];

const getItems = (res) => {
  res.json(items);
};

const postItem = (req, res) => {
  console.log('post req body', req.body);
  const newItem = req.body;
  newItem.id = items[items.length - 1].id + 1;
  items.push(newItem);
  res.status(201).json({message: 'Item added', id: newItem.id});
};

const getItemById = (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find((item) => item.id === id);
  if (item) {
    if (req.query.format === 'plain') {
      res.send(item.name);
    } else {
      res.json(item);
    }
  } else {
    res.status(404).json({message: 'Item not found'});
  }
};

export {getItems, postItem, getItemById};
