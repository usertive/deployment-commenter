import {context} from '@actions/github';
import {Octokit, CommitComment, IssueComment, AnyComment} from '../../types/Octokit.js';
import {commentBodyHeader} from './createCommentBody.js';

export async function findPreviousCommitComment(octokit: Octokit): Promise<AnyComment | undefined> {
  const response = await octokit.rest.repos.listCommentsForCommit({
    ...context.repo,
    commit_sha: context.sha,
  });

  return response.data.find((comment: CommitComment) => {
    comment.body.startsWith(commentBodyHeader);
  });
}

export async function findPreviousIssueComment(octokit: Octokit): Promise<IssueComment | undefined> {
  const response = await octokit.rest.issues.listComments({
    ...context.repo,
    issue_number: context.issue.number,
  });

  return response.data.find((comment: IssueComment) => {
    comment.body?.startsWith(commentBodyHeader);
  });
}
