import * as core from '@actions/core'
import * as github from '@actions/github'
import { PullRequestEvent } from '@octokit/webhooks-types'
import { Context } from '@actions/github/lib/context'

const validEvent: string[] = [
  'create',
  'push',
  'pull_request',
  'pull_request_target'
]

function getBranchName(ctx: Context): string {
  let payload: PullRequestEvent

  switch (ctx.eventName) {
    case 'create':
      if (ctx.payload.ref_type !== 'branch') {
        throw new Error(
          `ref_type must be "branch" but got ${ctx.payload.ref_type}`
        )
      }
      return ctx.ref.replace('refs/heads/', '')
    case 'pull_request_target':
    case 'pull_request':
      payload = ctx.payload as PullRequestEvent
      return payload.pull_request.head.ref
    case 'push':
      return ctx.ref.replace('refs/heads/', '')
    default:
      throw new Error(`Invalid event name: ${ctx.eventName}`)
  }
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  const allowedPrefixesInput: string = core.getInput('allowed_prefixes')
  const excludeInput: string = core.getInput('ignore')
  const regexInput: string = core.getInput('regex')

  const allowedPrefixList: string[] = allowedPrefixesInput.split(',')
  const excludeList: string[] = excludeInput
    .split(',')
    .map((item: string): string => item.trim())
  const regexPattern = RegExp(regexInput)

  core.info(`Allowed Prefixes: ${allowedPrefixList.join('')}`)
  core.info(`Exclude list: ${excludeList.join(', ')}`)
  core.info(`Regex: ${regexInput}`)

  try {
    core.info(`Event name: ${github.context.eventName}`)
    if (validEvent.includes(github.context.eventName)) {
      core.setFailed(`Invalid event: ${github.context.eventName}`)
      return
    }

    const branchName = getBranchName(github.context)
    core.info(`Branch name: ${branchName}`)

    // check against exclude list
    if (
      excludeList.length > 0 &&
      excludeList.some((el: string): boolean => branchName === el)
    ) {
      core.info(
        `${branchName} is in the exclude list: ${excludeList.join(', ')}`
      )
      return
    }

    // check against regex
    if (!regexPattern.test(branchName)) {
      core.setFailed(`${branchName} does not match regex: ${regexPattern}`)
      return
    }

    // check against allowed prefixes
    if (
      allowedPrefixList.length > 0 &&
      !allowedPrefixList.some((el: string): boolean =>
        branchName.startsWith(el)
      )
    ) {
      core.setFailed(
        `${branchName} does not start with an allowed prefix: ${allowedPrefixList.join(', ')}`
      )
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    let message = 'Unknown Error'
    if (error instanceof Error) message = error.message
    core.setFailed(message)
  }
}
