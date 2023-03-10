import {DeploymentDomains, getDeploymentDomains} from '../domains/getDeploymentDomains.js';

export const commentBodyHeader: string = '### 🚀 Successfully deployed to Vercel.';

export function createCommentBody(): string {
  let commentBody = commentBodyHeader + '\n\n';

  const deploymentDomains: DeploymentDomains = getDeploymentDomains();

  if('branch' in deploymentDomains) {
    commentBody += `📗 Branch deployment\n${deploymentDomains.branch}\n`;
  } else {
    commentBody += `📘 Preview deployment\n${deploymentDomains.unique}\n`;
  }

  commentBody += '\n---';

  return commentBody;
}
