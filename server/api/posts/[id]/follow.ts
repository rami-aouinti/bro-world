export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return { message: `You followed the author of post ${id}` }
})
