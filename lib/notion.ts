import { Client } from '@notionhq/client'
import {
  BlockObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export async function getPages() {
  const { results } = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID as string,
  })

  return results as PageObjectResponse[]
}

export async function getPage(pageId: string) {
  return (await notion.pages.retrieve({
    page_id: pageId,
  })) as never as PageObjectResponse
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
