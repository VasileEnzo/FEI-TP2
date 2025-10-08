import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({

  async create(ctx) {
    const u = ctx.state.user;
    if (!u) return ctx.unauthorized('Debes iniciar sesión');

    const { data } = ctx.request.body || {};
    if (!data) return ctx.badRequest('Missing "data" payload');

    data.user = u.id;

    const created = await strapi.entityService.create('api::comment.comment', { data });
    const withUser = await strapi.entityService.findOne('api::comment.comment', created.id, { populate: '*' });

    const sanitized = await this.sanitizeOutput(withUser, ctx);
    return this.transformResponse(sanitized);
  },

  async delete(ctx) {
    const u = ctx.state.user;
    if (!u) return ctx.unauthorized('Debes iniciar sesión');

    const { id } = ctx.params;

    const comment = await strapi.entityService.findOne('api::comment.comment', Number(id), { populate: '*' });
    if (!comment) return ctx.notFound('Comentario no encontrado');

    const authorId =
      (comment as any)?.user?.id ??
      (comment as any)?.users_permissions_user?.id ??
      null;

    const postOwnerId =
      (comment as any)?.post?.owner?.id ??
      (comment as any)?.post?.user?.id ??
      (comment as any)?.post?.users_permissions_user?.id ??
      null;

    const canDelete = authorId === u.id || postOwnerId === u.id;
    if (!canDelete) return ctx.forbidden('No tienes permiso para eliminar este comentario');

    const entity = await strapi.entityService.delete('api::comment.comment', Number(id));
    const sanitized = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitized);
  }

}));
