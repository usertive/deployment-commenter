import {context, getOctokit} from '@actions/github';
import {failSafeMiddleware} from './middlewares/failSafeMiddleware.js';
import {NextCall} from './middlewares/definitions.js';
import {AnyComment, CommitComment, IssueComment, Octokit} from './types/Octokit.js';
import {createCommentBody} from './features/comments/createCommentBody.js';
import {findPreviousCommitComment, findPreviousIssueComment} from './features/comments/findPreviousComment.js';
import * as core from '@actions/core';

async function bootstrap(): Promise<void> {
  const githubToken: string | undefined = process.env.GITHUB_TOKEN;

  if (!githubToken) throw new Error('Missing `GITHUB_TOKEN` environment variable.');

  const octokit: Octokit = getOctokit(githubToken);

  core.debug('Successfully authenticated with Octokit.');

  const commentBody: string = createCommentBody();

  switch (context.eventName) {
    case 'push': {
      core.debug('`push` event type detected');

      const previousComment: AnyComment | undefined = await findPreviousCommitComment(octokit);

      if (previousComment) {
        core.debug(`Found previous comment with ID ${previousComment.id}.`);

        const response = await octokit.rest.repos.updateCommitComment({
          ...context.repo,
          comment_id: previousComment.id,
          body: commentBody,
        });
        const comment: CommitComment = response.data;

        core.debug(`Updated existing comment with ID ${comment.id}.`);
      } else {
        const response = await octokit.rest.repos.createCommitComment({
          ...context.repo,
          commit_sha: context.sha,
          body: commentBody,
        });
        const comment: CommitComment = response.data;

        core.debug(`Created new comment with ID ${comment.id}.`);
      }
      break;
    }
    case 'pull_request':
    case 'pull_request_target': {
      core.debug('`pull_request*` event type detected');

      const previousComment: AnyComment | undefined = await findPreviousIssueComment(octokit);

      if (previousComment) {
        core.debug(`Found previous comment with ID ${previousComment.id}.`);

        const response = await octokit.rest.issues.updateComment({
          ...context.repo,
          comment_id: previousComment.id,
          body: commentBody,
        });
        const comment: IssueComment = response.data;

        core.debug(`Updated existing comment with ID ${comment.id}.`);
      } else {
        const response = await octokit.rest.issues.createComment({
          ...context.repo,
          issue_number: context.issue.number,
          body: commentBody,
        });
        const comment: IssueComment = response.data;

        core.debug(`Created new comment with ID ${comment.id}.`);
      }
      break;
    }
    default:
      throw new Error(`Unsupported event type \`${context.eventName}\`.`);
  }

  core.debug('Done.');
}

const action: NextCall = failSafeMiddleware(bootstrap);

action();
