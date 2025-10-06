import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  async create(ctx) {
    // Debe venir autenticado
    const authUser = ctx.state.user;
    if (!authUser) {
      return ctx.unauthorized('Debe iniciar sesión');
    }

    // data enviado por el front
    const { data } = ctx.request.body || {};
    if (!data) {
      return ctx.badRequest('Missing "data" payload');
    }

    // Forzar owner en el servidor (evita errores por el front)
    // En v5 esto suele aceptar el id numérico del user de Users & Permissions
    data.users_permissions_user = authUser.id;

    // Si querés autogenerar algo más (ej: fecha_creacion)
    if (!data.fecha_creacion) data.fecha_creacion = new Date().toISOString();

    // Crear
    const entity = await strapi
      .service('api::post.post')
      .create({ data });

    const sanitized = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitized);
  },
}));