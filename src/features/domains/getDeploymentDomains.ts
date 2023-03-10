import {context} from '@actions/github';
import * as core from '@actions/core';

export type DeploymentDomains = {unique: string} | {branch: string};

export function getDeploymentDomains(): DeploymentDomains {
  switch (context.eventName) {
    case 'pull_request':
    case 'pull_request_target':
      return {
        unique: core.getInput('unique-deployment-domain'),
      };
    case 'push':
      return {
        branch: core.getInput('unique-deployment-domain')
      };
    default:
      throw new Error(`Unsupported event type \`${context.eventName}\`.`);
  }
}
