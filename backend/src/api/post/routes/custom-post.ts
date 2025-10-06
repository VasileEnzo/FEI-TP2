export default {
  routes: [
    {
      method: 'GET',
      path: '/posts/by-post-id/:postId',
      handler: 'post.findByPostId',
      config: {
        // NO pongas `auth: true/false` acá
        policies: [],
        middlewares: [],
      },
    },
  ],
};
