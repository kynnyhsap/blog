import { Client } from '@notionhq/client'
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export async function getDatabase() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID as string,
  })
  return response.results
}

export async function getPage(pageId: string) {
  return notion.pages.retrieve({ page_id: pageId })
}

export async function getBlocks(blockId: string) {
  const blocks: BlockObjectResponse[] = []

  let cursor
  while (true) {
    const { next_cursor, results } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    })

    blocks.push(...(results as BlockObjectResponse[]))

    if (!next_cursor) {
      break
    }

    cursor = next_cursor
  }
  return blocks
}
