export default {
  routes: [
    { method: 'GET', path: '/comments', handler: 'comment.find' },
    { method: 'GET', path: '/comments/:id', handler: 'comment.findOne' },
    { method: 'POST', path: '/comments', handler: 'comment.create' },
    { method: 'DELETE', path: '/comments/:id', handler: 'comment.delete' }
  ]
}
