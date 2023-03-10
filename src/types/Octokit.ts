import {getOctokit} from '@actions/github';
import {components} from '@octokit/openapi-types';

export type Octokit = ReturnType<typeof getOctokit>;

export type CommitComment = components['schemas']['commit-comment'];
export type IssueComment = components['schemas']['issue-comment'];
export type AnyComment = CommitComment | IssueComment;
