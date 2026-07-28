import * as core from '@actions/core'
import { context } from '@actions/github'

const styleBold = '\u001b[1m'
const styleReset = '\u001b[0m'

interface PullRequestPayload {
  pull_request: {
    head: {
      ref: string
    }
  }
}

const validEvent: string[] = [
  'create',
  'push',
  'pull_request',
  'pull_request_target'
]

/**
 * Error raised when the event that triggered the action `create` but the ref type
 * is not a branch.
 *
 * @class CreateNotBranchError
 * @extends {Error}
 */
class CreateNotBranchError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'CreateNotBranchError'
  }
}

/**
 * Error raised when something is not implemented.
 *
 * @class NotImplementedError
 * @extends {Error}
 */
class NotImplementedError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'NotImplementedError'
  }
}

/**
 * Get the branch name.
 *
 * @returns {string} Name of the branch.
 */
function getBranchName(ctx: typeof context): string {
  switch (ctx.eventName) {
    case 'create':
      if (ctx.payload.ref_type !== 'branch') {
        throw new CreateNotBranchError(
          `ref_type must be "branch" but got ${ctx.payload.ref_type}`
        )
      }
      return ctx.ref.replace('refs/heads/', '')
    case 'pull_request_target':
    case 'pull_request': {
      const payload = ctx.payload as unknown as PullRequestPayload
      return payload.pull_request.head.ref
    }
    case 'push':
      return ctx.ref.replace('refs/heads/', '')
    default:
      throw new NotImplementedError(`Invalid event name: ${ctx.eventName}`)
  }
}

/**
 * The main function for the action.
 *
 * @export
 * @return {Promise<void>}
 */
export async function run(): Promise<void> {
  const allowedPrefixesInput: string = core.getInput('allowed_prefixes')
  const excludeInput: string = core.getInput('exclude')
  const regexInput: string = core.getInput('regex')

  const allowedPrefixList: string[] = allowedPrefixesInput
    .split(',')
    .map((item: string): string => item.trim())
  const excludeList: string[] = excludeInput
    .split(',')
    .map((item: string): string => item.trim())
  const regexPattern = RegExp(regexInput)

  core.info(
    `${styleBold}Allowed Prefixes:${styleReset} ${allowedPrefixList.join(', ')}`
  )
  core.info(`${styleBold}Exclude list:${styleReset} ${excludeList.join(', ')}`)
  core.info(`${styleBold}Regex:${styleReset} ${regexInput}`)

  try {
    core.info(`${styleBold}Event name:${styleReset} ${context.eventName}`)
    if (!validEvent.includes(context.eventName)) {
      core.setFailed(`Invalid event: ${context.eventName}`)
      return
    }

    const branchName = getBranchName(context)
    core.info(`${styleBold}Branch name:${styleReset} ${branchName}`)

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
    if (error instanceof CreateNotBranchError) {
      core.info(
        `${context.eventName} event with ref_type ${context.payload.ref_type} isn't a branch`
      )
      return
    }

    let message = 'Unknown Error'
    if (error instanceof Error) message = error.message
    core.setFailed(message)
  }
}
