// src/api/post/controllers/post.ts
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Debes iniciar sesión');
    }

    // Aseguramos el envoltorio { data: ... }
    const body = (ctx.request.body ?? {}) as { data?: any };
    if (!body.data) body.data = {};

    // Setear autor (users_permissions_user)
    body.data.users_permissions_user = user.id;

    // Autogenerar post_id si no vino
    if (body.data.post_id == null) {
      const last = await strapi.entityService.findMany('api::post.post', {
        fields: ['post_id'],
        sort: { post_id: 'desc' },
        limit: 1,
      });
      const next = (last?.[0] as any)?.post_id ? Number((last as any)[0].post_id) + 1 : 1;
      body.data.post_id = next;
    }

    // Setear fecha_creacion si no vino
    if (!body.data.fecha_creacion) {
      body.data.fecha_creacion = new Date().toISOString();
    }

    // Reasignamos el body normalizado
    ctx.request.body = body;

    // Llamamos al core controller
    const res = await (this as any).super.create(ctx);
    return res;
  },

  // GET /posts/by-post-id/:postId
  async findByPostId(ctx) {
    const { postId } = ctx.params as { postId: string };
    const publicationState = ctx.state.user ? 'preview' : 'live';

    const items = await strapi.entityService.findMany('api::post.post', {
      filters: { post_id: postId },
      populate: '*',
      publicationState,
      limit: 1,
    });

    if (!items || (Array.isArray(items) && items.length === 0)) {
      return ctx.notFound('Post no encontrado');
    }

    // Devolvemos el primero (por ser único)
    return { data: Array.isArray(items) ? items[0] : items };
  },
}));
