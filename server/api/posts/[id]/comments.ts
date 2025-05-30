export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  return { message: `Comment added to post ${id}`, comment: body }
})
