/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import * as core from '@actions/core'

beforeAll(() => {
  process.env.GITHUB_EVENT_NAME = 'push'
  process.env.GITHUB_REF = 'refs/heads/main'
  process.env.INPUT_REGEX = '.*'
})

describe('index', () => {
  it('loads the action runtime packages', async () => {
    const { context } = await import('@actions/github')
    const { run } = await import('../src/main')

    expect(core.getInput).toBeInstanceOf(Function)
    expect(context).toBeDefined()
    expect(run).toBeInstanceOf(Function)
  })

  it('runs when imported', async () => {
    await expect(import('../src/index')).resolves.toBeDefined()
  })
})
