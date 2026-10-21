import test from 'node:test';
import assert from 'node:assert/strict';
import {feedbackIssueUrl} from '../src/feedback.js';

test('bug and feature drafts have distinct prompts and the actual current view',()=>{
 for(const view of ['planning','guided']) {
  const bug=new URL(feedbackIssueUrl('bug',{journey:'cambodia-1979',view,edition:3}));
  const feature=new URL(feedbackIssueUrl('feature',{journey:'cambodia-1979',view,edition:3}));
  assert.equal(bug.origin,'https://github.com');
  assert.equal(bug.pathname,'/thachp/theundocumentedtrail/issues/new');
  assert.match(bug.searchParams.get('body'),/Steps to reproduce/);
  assert.match(feature.searchParams.get('body'),/How would it improve the journey/);
  assert.match(bug.searchParams.get('body'),new RegExp(`View: ${view==='planning'?'Planning':'Guided'}`));
  assert.match(bug.searchParams.get('body'),/Journey: cambodia-1979\n- View: .+\n- Edition: 3/);
 }
});

test('only allowlisted context is included; URLs, saves, personal data and injected text are ignored',()=>{
 const context={journey:'ramirez',view:'guided',save:{name:'PRIVATE_NAME'},url:'https://example.com/?token=PRIVATE_TOKEN',email:'PRIVATE_EMAIL',edition:'PRIVATE_EDITION'};
 let body=new URL(feedbackIssueUrl('bug',context)).searchParams.get('body');
 assert.doesNotMatch(body,/PRIVATE_|https:|Edition:/);
 body=new URL(feedbackIssueUrl('bug',{journey:'ramirez\nPRIVATE_INJECTION',view:'PRIVATE_VIEW',edition:999})).searchParams.get('body');
 assert.match(body,/Journey: Not selected/);assert.doesNotMatch(body,/PRIVATE_|999/);
});
