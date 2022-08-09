export default function (server) {
  let otherList = server.create('list', { name: 'Other', listType: 'list' });
  server.create('task', {
    list: otherList,
  });
}
