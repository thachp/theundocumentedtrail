export const FEEDBACK_REPOSITORY = 'https://github.com/thachp/theundocumentedtrail';

// Explicit context only: never serialize the page URL, a save, or browser storage.
export function feedbackIssueUrl(type, context = {}) {
 const bug = type === 'bug';
 const journey = /^[a-z0-9-]{1,60}$/.test(context.journey ?? '') ? context.journey : 'Not selected';
 const view = context.view === 'planning' ? 'Planning' : 'Guided';
 const edition = [1,2,3].includes(context.edition) ? `\n- Edition: ${context.edition}` : '';
 const prompts = bug
  ? '## What happened?\n\n\n## What did you expect?\n\n\n## Steps to reproduce\n1. \n2. \n3. \n\n## Browser / device (optional)\n\n'
  : '## Feature idea\n\n\n## What problem would it solve?\n\n\n## How would it improve the journey?\n\n';
 const body = `${prompts}\n## Journey context\n- Journey: ${journey}\n- View: ${view}${edition}\n\nPlease avoid including personal information or saved-game data.\n`;
 const url = new URL(`${FEEDBACK_REPOSITORY}/issues/new`);
 url.search = new URLSearchParams({title:bug?'[Bug] ':'[Feature] ',body,template:'blank'}).toString();
 return url.href;
}
